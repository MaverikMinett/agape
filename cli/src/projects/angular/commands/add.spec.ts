import {} from "jasmine"

import { AngularProject } from '../project'
import { AddToAngularProjectCommand } from './add'

import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'


import { v4 as uuidv4 } from 'uuid';

let p, c;
describe('AddToAngularProjectCommand', () => {
    afterEach( () => {
        p = undefined;
    })

    it('should instantiate', () => {
        p = new AngularProject()
        c = new AddToAngularProjectCommand( p )
        expect(c).toBeTruthy()
    })



})


