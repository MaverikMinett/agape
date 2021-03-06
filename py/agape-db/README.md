# Agape

Field factories for Django models

## Synopsis

```
from django.db.models import Model
from agape import db

class Person( Model ):

    first_name = db.string( 32, required=True )

    last_name  = db.string( 32, required=True )

    birthday   = db.date( )

    email      = db.email( )

```

## Description

Shorthand for building Django models.

Fields default to `null=True` and `blank=True`. Setting `required=True` will set both `null` and `blank` to `False` on the native Django field.

## Fields

These factory methods are wrappers over the native Django fields.
Fields that have required parameters use ordered arguments
instead of requiring named arguments. You may pass in any named
arguments that the native Django fields accept. Additional arguments may are also provided for specific fields.

### `boolean( )`

### `color( )`

### `date( )`

### `datetime( )`

### `decimal( max_digits, decimal_places )`

### `duration( )`

### `email( )`

### `file( )`

### `float( )`

### `image( )`

### `integer( )`

### `small_integer( )`

### `join( model, on_delete_policy )`

### `slug( from_field, auto=True )`

If the optional `auto` paramter is set to `True` the slug will
be automatically when the instance is saved for the first time.

### `string( max_length )`

### `user( on_delete_policy, auto=True, auto_add=True )

User field which will auto populate on the instance is updated
or created. Set `auto=True` to update the field each time the
instance is saved, or `auto_add=True` only when the instance
is saved for the first time.

You must add the `agape.db.middleware.AgapeUserMiddleware` to
your `settings.py` file to use `auto` and `auto_add`.


## License

Copyright (C) 2021 Maverik Minett

The (MIT) license.