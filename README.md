Edit an ember DS.model inline by clicking on it to toggle editor.
Click outside or press escape to rollback change and cancel edit.

inspired by [ember-inline-edit](https://github.com/swastik/ember-inline-edit)

![Inline Edit Demo](https://github.com/IliasDeros/ember-ds-inline-edit/raw/master/demo.gif)

## Installation

`ember install ember-ds-inline-edit`

## Usage

Use the `ds-inline-edit` component and provide it a model with the property to edit/display.

```handlebars
  {{ds-inline-edit
    model=model
    prop='name'
    onError=(action send 'onError')
    onUpdate=(action send 'onUpdate')
  }}
```

Customize input template using `#ds-inline-edit` :

```handlebars
  {{#ds-inline-edit model=person prop='age' as |age|}}
    {{input type="number" class="form-control" value=age}}
  {{/ds-inline-edit}}
```

#### Ember Data Integration

This plugin relies on a strict usage of Ember Data. An automatic model update
is sent upon confirming edit.

If the `prop` is an object, the default display is the following property of the model :
`displayName` > `name` > `id`

Only the property identified through `prop` is updated, the rest of the model remains
uncommited.

When an update is successful, the `onUpdate` function is called with the updated model.

#### Keyboard Support

Hit `enter` to confirm changes.
Hit `esc` or click outside the component to discard the changes.

#### Error Handling
When an error occurs, an `onError` action is executed.