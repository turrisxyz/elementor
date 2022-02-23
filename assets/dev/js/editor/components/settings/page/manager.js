import Component from './component';
import ChildrenArray from 'elementor-editor/container/model/children-array';

var BaseSettings = require( 'elementor-editor/components/settings/base/manager' );

module.exports = BaseSettings.extend( {
	getStyleId: function() {
		return this.getSettings( 'name' ) + '-' + elementor.documents.getCurrent().id;
	},

	onInit: function() {
		BaseSettings.prototype.onInit.apply( this );

		$e.components.register( new Component( { manager: this } ) );
	},

	save: function() {},

	getDataToSave: function( data ) {
		data.id = elementor.config.document.id;

		return data;
	},

	// Emulate an element view/model structure with the parts needed for a container.
	getEditedView() {
		if ( this.editedView ) {
			return this.editedView;
		}

		const documentElementType = elementor.elementsManager.getElementType( 'document' ),
			ModelClass = documentElementType.getModel(),
			type = this.getContainerType(),
			editModel = new ModelClass( {
				id: type,
				elType: type,
				settings: this.model,
				elements: elementor.elements,
			} ),
			container = new elementorModules.editor.Container( {
				type: type,
				id: editModel.id,
				model: editModel,
				settings: editModel.get( 'settings' ),
				label: elementor.config.document.panel.title,
				controls: this.model.controls,
				children: new ChildrenArray( ... elementor.elements || [] ),
				parent: false,
				// Emulate a view that can render the style.
				renderer: {
					view: {
						lookup: () => container,
						renderOnChange: () => this.updateStylesheet(),
						renderUI: () => this.updateStylesheet(),
					},
				},
			} );

		this.editedView = {
			getContainer: () => container,
			getEditModel: () => editModel,
			model: editModel,
		};

		return this.editedView;
	},

	getContainerType() {
		return 'document';
	},
} );
