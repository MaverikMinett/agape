import {} from "jasmine"

import { coerce } from './coerce'
import { readonly } from './readonly'
import { lazy } from './lazy'
import { deflate, inflate, Serializer } from "../serializer";
import { Dictionary } from "../types";



let o;
describe('coerce decorator', () => {

    beforeEach( () => {
        o = undefined;
    })

    it('should set the coerce value on a property descriptor to a class', () => {

        class Foo {

        }

        class Bar {
            @coerce( Foo )
            foo: Foo
        }

        const m = (<any>Bar.prototype).Δmeta
        expect( m.property('foo').ʘcoerce ).toEqual(Foo)
    })

    it('should set the coerce value on a property descriptor to an array', () => {
        class Foo {

        }

        class Bar {
            @coerce( [Foo] )
            foos: Foo
        }

        const m = (<any>Bar.prototype).Δmeta
        expect( m.property('foos').ʘcoerce ).toEqual([Foo])
    })

    it('should coerce using a custom inflator', () => {


        class Foo {

        }

        class AFoo extends Foo {

            abaz: string

        }

        class BFoo extends Foo {
            bbaz: string
        }   

        class FooSerializer extends Serializer {

            inflate( from:Dictionary, params={} ) {
                
                const type = from.type
                delete from.type

                switch( type ) {
                    case "a":
                        return inflate( AFoo, from )
                    case "b":
                        return inflate( BFoo, from )
                }

            }

        }

        class Bar {

            @coerce( new FooSerializer() )
            foo: AFoo|BFoo
        }


        const b = inflate<Bar>(Bar, { foo: { type: "b", bbaz: "yeah" } } )
        expect( b ).toBeInstanceOf( Bar )
        expect( b.foo ).toBeInstanceOf( Foo )
        expect( b.foo ).toBeInstanceOf( BFoo )

        if ( b.foo instanceof BFoo ) {
            expect( b.foo.bbaz ).toBe("yeah")
        }

       
        const a = inflate<Bar>(Bar, { foo: { type: "a", abaz: "yeah" } } )
        expect( a ).toBeInstanceOf( Bar )
        expect( a.foo ).toBeInstanceOf( Foo )
        expect( a.foo ).toBeInstanceOf( AFoo )

        if ( a.foo instanceof AFoo ) {
            expect( a.foo.abaz ).toBe("yeah")
        }

    })

    it('should coerce an array using a custom inflator', () => {


        class Foo {

        }

        class AFoo extends Foo {

            abaz: string

        }

        class BFoo extends Foo {
            bbaz: string
        }   

        class FooSerializer extends Serializer {

            inflate( from:Dictionary, params={} ) {
                
                const type = from.type
                delete from.type

                switch( type ) {
                    case "a":
                        return inflate( AFoo, from )
                    case "b":
                        return inflate( BFoo, from )
                }

            }

        }

        class Bar {

            @coerce( [ new FooSerializer() ] )
            foos: Array<AFoo|BFoo>
        }


        const o = inflate<Bar>(Bar, { foos: [{ type: "b", bbaz: "yeah" }, { type: "a", abaz: "buddy" }] } )
        expect( o ).toBeInstanceOf( Bar )
        expect( Array.isArray(o.foos) ).toBeTrue()
        expect( o.foos[0] ).toBeInstanceOf( BFoo )

        if ( o.foos[0] instanceof BFoo ) {
            expect( o.foos[0].bbaz ).toBe("yeah")
        }

        if ( o.foos[1] instanceof AFoo ) {
            expect( o.foos[1].abaz ).toBe("buddy")
        }

    })


    it('should coerce using a custom deflator', () => {

        class Foo {

        }

        class AFoo extends Foo {
            abaz: string
        }

        class BFoo extends Foo {
            bbaz: string
        }   

        class FooSerializer extends Serializer {
            deflate( object:Object, params={} ) {
                
                const data = deflate( object )

                if ( object instanceof AFoo ) {
                    data.type = "a"
                }
                else if ( object instanceof BFoo ) {
                    data.type = "b"
                }

                return data

            }
        }

        class Bar {

            @coerce( new FooSerializer() )
            foo: AFoo|BFoo
        }

        const b = new Bar()
        b.foo = new AFoo()
        b.foo.abaz = "yeah"

        const d = deflate(b)
        expect(d).toEqual({ foo: { abaz: "yeah", type: "a" } } )

    })

    it('should coerce using a custom deflator', () => {

        class Foo {

        }

        class AFoo extends Foo {
            constructor( public abaz: string ) {
                super()
            }
        }

        class BFoo extends Foo {
            constructor( public bbaz: string ) {
                super()
            }
        }   

        class FooSerializer extends Serializer {
            deflate( object:Object, params={} ) {
                
                const data = deflate( object )

                if ( object instanceof AFoo ) {
                    data.type = "a"
                }
                else if ( object instanceof BFoo ) {
                    data.type = "b"
                }

                return data

            }
        }

        class Bar {

            @coerce( [ new FooSerializer() ] )
            foos: Array<AFoo|BFoo>
        }

        const b = new Bar()
        b.foos = [new BFoo( "yeah" ), new AFoo("buddy") ]

        const d = deflate(b)
        expect(d).toEqual({ foos: [{ bbaz: "yeah", type: "b" } , { abaz: "buddy", type: "a" }] } )

    })
})