import Ember from 'ember'
import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { startMirage } from 'dummy/initializers/ember-cli-mirage'

moduleForComponent('ds-inline-edit', 'DsInlineEdit', {
  integration: true,

  beforeEach(){
    this.inject.service('store')
    this.server = startMirage()
  },

  afterEach(){
    this.server.shutdown()
  }
})

test('updating a property does not update the rest of the model', function(assert) {
  const done = assert.async()
  const enterKeyCode = 13
  const { id } = this.server.create('dummy')

  Ember.run(() => this.store.findRecord('dummy', id).then(model => renderComponent.call(this, model)))

  function renderComponent(model){
    this.set('model', model)

    this.render(hbs`
      {{ds-inline-edit
        model=model
        prop="description"
        id="component"
      }}
    `)

    // click input to toggle edit mode
    Ember.run(() => this.$('#component').click())

    // enter new value and trigger ember "value" observers
    Ember.run(() => this.$('#component input')
      .val('new description')
      .trigger('change')
    )

    // update another unrelated value
    model.set('name', 'new name')

    // press enter to submit
    const enter = Ember.$.Event('keydown')
    enter.which = enterKeyCode
    Ember.run(() => this.$('#component').trigger(enter))

    // let model.save() update "model"
    Ember.run.next(verifyPersistence.bind(this))

    function verifyPersistence(){
      assert.notEqual(model.get('name'), 'new name', 'other field is not updated')
      assert.equal(model.get('description'), 'new description', 'description is updated')

      // let model be updated upon model.save() resolution
      Ember.run.next(() => {
        assert.equal(model.get('name'), 'new name', 'other is set back to its modified value once model is persisted')
        done()
      })
    }
  }
})

test('"displayValue" displayed correctly for object model', function(assert){
  const done = assert.async()
  const { id } = this.server.create('dummy')
  Ember.run(() => this.store.findRecord('dummy', id).then(dummy => renderComponent.call(this, dummy)))

  function renderComponent(dummy){
    const model = Ember.Object.create({ dummy })
    this.set('model', model)

    // 1. displayName
    dummy.set('displayName', 'expected display name')
    renderTemplate.call(this)
    assert.ok(this.$('#component > span').text().includes('expected display name'), 'idle value is "displayName" first')

    // 2. name
    dummy.set('displayName', null)
    renderTemplate.call(this)
    assert.ok(this.$('#component > span').text().includes(dummy.get('name')), 'idle value is "name" if no displayName')

    // 3. id
    dummy.set('name', null)
    renderTemplate.call(this)
    assert.ok(this.$('#component > span').text().includes(dummy.get('id')), 'idle value is id if no displayName or name')

    done()
  }

  function renderTemplate(){
    this.render(hbs`
      {{ds-inline-edit
        model=model
        prop="dummy"
        id="component"
      }}
    `)
  }
})