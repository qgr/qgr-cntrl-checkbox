define( [
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!tmpl/checkbox.html'
  ],
  function ($, _, Backbone, Handlebars, checkbox_tmpl) {

  var CheckboxChoice = Backbone.Model.extend({
    // Has attr choice_val

    initialize: function() {
      this.set('checked', true);
    }

  });

  var CheckboxChoices = Backbone.Collection.extend({

    model: CheckboxChoice,

  });

  var CheckboxChoiceView = Backbone.View.extend({
    // Represent an individual checkbox with a view.

    tagName: 'label',

    class: 'checkbox',

    tmpl: Handlebars.compile(checkbox_tmpl),

    events: {
      'click input': 'set_choice',
      'click': 'clicked',
    },

    initialize: function(options) {
      // Initialize with a choice model in the options hash.
      _.bindAll(this, 'render', 'set_choice')
      this.choice = this.options.choice;
    },

    render: function() {
      var render_content = this.tmpl({
        label: this.choice.get('choice_val'),
      })
      this.$el.html(render_content);
      return this
    },

    set_choice: function(e) {
      var checked = this.$el.find('input').prop('checked');
      this.choice.set('checked', checked)
    },

    clicked: function(e) {
      e.stopImmediatePropagation();
    }

  });


  var CheckboxChoicesView = Backbone.View.extend({
    // Represent a collection of checkboxes as a view.

    initialize: function(options) {
      // Initialize with a CheckboxChoices collection and a ref to the
      // global_q object, and the target column.
      _.bindAll(this, 'render', 'set_filters')
      this.choices = this.options.choices;
      this.global_q = this.options.global_q;
      this.col = this.options.col;
      this.choices.on('reset', this.render);
      this.choices.on('change', this.set_filters);
    },

    render: function() {
      var $el = this.$el;
      this.choices.each(function(c) {
        var choice_view = new CheckboxChoiceView({choice: c});
        $el.append(choice_view.render().el);
      });
    },

    set_filters: function() {
      // This control is represented as an 'in' clause.
      var filtered = this.choices.where({checked: true});
      var in_list = _.map(filtered, function(c) {
        return c.get('choice_val');
      });
      this.global_q.set('w', {
        col: this.col,
        op: 'in',
        other: in_list,
      });
    }

  });

  // Return exports.
  return {
    CheckboxChoice: CheckboxChoice,
    CheckboxChoices: CheckboxChoices,
    CheckboxChoiceView: CheckboxChoiceView,
    CheckboxChoicesView: CheckboxChoicesView
  };

});

