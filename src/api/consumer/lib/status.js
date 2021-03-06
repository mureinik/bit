/** @flow */
import R from 'ramda';
import { loadConsumer } from '../../../consumer';
import Component from '../../../consumer/component';
import ComponentsList from '../../../consumer/component/components-list';

export default function status(): Promise<{ inline: Component[], sources: Component[]}> {
  return loadConsumer()
  .then((consumer) => {
    const componentsList = new ComponentsList(consumer);
    const newComponents = componentsList.listNewComponents(true);
    const modifiedComponent = componentsList.listModifiedComponents(true);
    const stagedComponents = componentsList.listExportPendingComponents();

    return Promise.all([newComponents, modifiedComponent, stagedComponents]);
  })
  .then(([newComponents, modifiedComponent, stagedComponents]) => {
    // Run over the components to check if there is missing depenedencies
    // If there is at least one we won't commit anything
    const newAndModified = newComponents.concat(modifiedComponent);
    const componentsWithMissingDeps = newAndModified.filter((component) => {
      return (component.missingDependencies && !R.isEmpty(component.missingDependencies));
    });
    console.log('componentsWithMissingDeps', componentsWithMissingDeps.length);

    return { newComponents, modifiedComponent, stagedComponents, componentsWithMissingDeps };
  });
}
