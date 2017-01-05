/** @flow */
import Command from '../command';
import { describeScope } from '../../api';
import { fromBase64, toBase64 } from '../../utils';

export default class Prepare extends Command {
  name = '_scope <path>';
  description = 'describe a scope';
  private = true;
  alias = '';
  opts = [];

  action([path, ]: [string]): Promise<*> {
    return describeScope(fromBase64(path));
  }

  report(scopeObj: any): string {
    return toBase64(JSON.stringify(scopeObj)); 
  }
}