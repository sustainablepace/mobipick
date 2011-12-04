/*
 * Mobi Pick - An Android-style datepicker widget for jQuery Mobile.
 * 
 * Created by Christoph Baudson. Contact me at http://twitter.com/sustainablepace
 *
 * Licensed under MIT license, see MIT-license.txt
 */
$.widget( "sustainablepace.mobipick", $.mobile.widget, {
	options: {
		dateFormat: "yyyy-MM-dd",
		locale:     "en"
	},
	widgetEventPrefix: "mobipick",
	// See http://stackoverflow.com/questions/6577346/jquery-bind-all-events-on-object
	_blockedEvents: "tap, touchstart, touchmove, blur, focus, focusin, focusout, load, resize, scroll, unload, click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, error",
	_markup: "<div class='datepicker-click-layer datepicker-overlay'></div><div class='datepicker-main-layer datepicker-overlay'><div class='datepicker-main'><div class='datepicker-date-formatted'>Date</div><ul class='datepicker-groups'><li><ul><li><a class='datepicker-next-day'>+</a></li><li><input type='text' class='datepicker-input datepicker-day' /></li><li><a class='datepicker-prev-day'>-</a></li></ul></li><li><ul><li><a class='datepicker-next-month'>+</a></li><li><input type='text' class='datepicker-input datepicker-month' /></li><li><a class='datepicker-prev-month'>-</a></li></ul></li><li><ul><li><a class='datepicker-next-year'>+</a></li><li><input type='text' class='datepicker-input datepicker-year' /></li><li><a class='datepicker-prev-year'>-</a></li></ul></li></ul><ul class='datepicker-buttons'><li><a class='datepicker-set'>Set</a></li><li><a class='datepicker-cancel'>Cancel</a></li></ul></div></div>",
	
	// Controller
	_getInstance: function() {
		return this.element.data( "mobipick" );
	},
	_create: function() {
		this._initOptions();          // parses options
		this._createView();           // inserts markup into DOM
		this._bindInputClickEvent();  // bind click event to input field
	},
	_initOptions: function() {
		var date    = this.element.val(),
		    minDate = this.element.attr( "min" ),
		    maxDate = this.element.attr( "max" );

		if( date ) {
			this._setOption( "date", new XDate( date ) );
		}
		// Min and max dates can be set in the markup.
		// See http://dev.w3.org/html5/markup/input.date.html
		if( maxDate ) {
			this._setOption( "maxDate", new XDate( maxDate ) );
		}
		if( minDate ) {
			this._setOption( "minDate", new XDate( minDate ) );
		}
		this._setOption( "locale", this.options.locale );
	},
	_bindInputClickEvent: function() {
		this.element.bind( "click", $.proxy( this._getInstance()._open, this ) );
	},
	_init: function() {
		// fill input field with default value
		if( this._isXDate( this._getDate() ) ) {
			this._updateDateInput();
		}
	},
	_open: function() {
		if( !this._isXDate( this._getDate() ) ) {
			this._setOption( "date", this._getInitialDate() );
		}			
		this._setOption( "originalDate", this._getDate() );

		this._updateView();
		this._bindEvents();
		this._showView();

	},
	_bindEvents: function() {
		var self = this,
		    p    = this._getPicker();
		
		// Set and Cancel buttons
		p.find( ".datepicker-set"    ).unbind().bind( "tap", $.proxy( this._getInstance()._confirmDate, this ) );
		p.find( ".datepicker-cancel" ).unbind().bind( "tap", $.proxy( this._getInstance()._cancelDate,  this ) );
		
		// +/- Buttons
		var selectorMap = {
			".datepicker-prev-day"   : "_prevDay",
			".datepicker-prev-month" : "_prevMonth",
			".datepicker-prev-year"  : "_prevYear",
			".datepicker-next-day"   : "_nextDay",
			".datepicker-next-month" : "_nextMonth",
			".datepicker-next-year"  : "_nextYear"
		};
		for( var selector in selectorMap ) {
			(function() {
				var dateHandler = self[ selectorMap[ selector ] ];
				if( !$.isFunction( dateHandler) ) {
					return;
				}
				p.find( selector ).unbind().bind( "tap", $.proxy( function() {
					self._getInstance()._handleDate( dateHandler );
				}, self ));
			})();
		}
	},
	_close: function() {
		this._hideView();
	},
	_handleDate: function( dateHandler ) {
		var d = dateHandler.apply( this );
		this._setOption( "date", this._fitDate( d ) );
	},
	_confirmDate: function() {
		var proceed = true,
		    dateChanged = this._getDate().diffDays( this.options.originalDate ) !== 0;
		
		if( this.options.close && typeof this.options.close === "function" ) {
			proceed = this.options.close.call() !== false;
		}
		if( proceed && dateChanged ) {
			this._setOption( "originalDate", this._getDate() );
			this._updateDateInput();
			this.element.trigger("change");
		} else {
			this._setOption( "date", this.options.originalDate );
		}
		this._close();
	},
	_cancelDate: function() {
		this._setOption( "date", this.options.originalDate );
		this._confirmDate();
	},
	_setOption: function( key, value ) {
		switch( key ) {
			case "date":
				this.options[ key ] = this._sanitizeDate( value ).toDate();
				break;
			case "originalDate":
				this.options[ key ] = this._sanitizeDate( value ).toDate();
				break;
			case "maxDate":
				this.options[ key ] = this._sanitizeMaxDate( value ).toDate();
				break;
			case "minDate":
				this.options[ key ] = this._sanitizeMinDate( value ).toDate();
				break;
			case "locale":
				if( this._isValidLocale( value ) ) {
					this.options.locale = value;
				}
				break;
			default:
				return $.Widget.prototype._setOption.apply( this, arguments );
		}
		this._updateView();
	},
	//
	// Model
	//
	_sanitizeDate: function( date ) {
		if( this._isXDate( date ) ) {
			date = date.toDate();
		}
		if( !this._isDate( date ) ) {
			throw "Parameter 'date' must be a Date.";
		}
		return new XDate( date.getFullYear(), date.getMonth(), date.getDate() );
	},
	_sanitizeMinDate: function( date ) {
		var minDate = this._sanitizeDate( date );
		if( this._isAfterMaxDate( minDate ) ) {
			throw "Min date must be before max date.";
		}
		return minDate;
	},
	_sanitizeMaxDate: function( date ) {
		var maxDate = this._sanitizeDate( date );
		if( this._isBeforeMinDate( maxDate ) ) {
			throw "Max date must be after min date.";
		}
		return maxDate;
	},
	dateString: function() {
		return this._getDate() ? this._getDate().toString( this.options.dateFormat ) : '';
	},
	localeString: function() {
		return this._getDate().toString( this._isValidLocale( this.options.locale ) ? 
			XDate.locales[ this.options.locale ].dateFormat : this.options.dateFormat
		);
	},
	_getInitialDate: function() {
		return this._fitDate( new XDate() );
	},
	_fitDate: function( d ) {
		return this._isAfterMaxDate( d ) ? this._getMaxDate() : 
			( this._isBeforeMinDate( d ) ? this._getMinDate() : d );
	},
	_isAfterMaxDate: function( d ) {
		var maxDate = this._getMaxDate();
		return this._isXDate( maxDate ) && d.diffDays( maxDate ) < 0;
	},
	_isBeforeMinDate: function( d ) {
		var m = this._getMinDate();
		return this._isXDate( m ) && m.diffDays( d ) < 0;
	},
	_isValidLocale: function( locale ) {
		return typeof locale === "string" && XDate.locales && 
			XDate.locales[ locale ];
	},
	_isDate: function( date ) {
		return typeof date === "object" && date !== null && 
			date.constructor === Date;
	},
	_isXDate: function( xdate ) {
		return typeof xdate === "object" && xdate !== null && 
			xdate.constructor === XDate;
	},
	_getMaxDate: function() {
		return this._isDate( this.options.maxDate ) ? 
			new XDate( this.options.maxDate ) : null;
	},
	_getMinDate: function() {
		return this._isDate( this.options.minDate ) ? 
			new XDate( this.options.minDate ) : null;
	},
	_getDate: function() {
		return this._isDate( this.options.date ) ? 
			new XDate( this.options.date ) : null;
	},
	_getDay: function( date ) {
		return this._isDate( date ) ? 
			date.getDate() : this._getDate().getDate();
	},
	_getMonth: function( date ) {
		return this._isDate( date ) ? 
			date.getMonth() : this._getDate().getMonth();
	},
	_getYear: function( date ) {
		return this._isDate( date ) ? 
			date.getFullYear() : this._getDate().getFullYear();
	},
	_prevDay: function() {
		return this._getDay() > 1 ? 
			this._getDate().addDays( -1 ) : 
			this._getDate().addDays( 30, true );
	},

	_nextDay: function() {
		var nextDay = this._getDate().addDays( 1, true );
		return this._getDate().diffDays( nextDay ) === 0 ? 
			this._getDate().setDate( 1 ) : 
			this._getDate().addDays( 1 );
	},
	_prevMonth: function() {
		return this._getMonth() > 0 ? 
			this._getDate().addMonths( -1, true ) : 
			this._getDate().setMonth( 11 );
	},
	_nextMonth: function() {
		return this._getMonth() < 11 ? 
			this._getDate().addMonths( 1, true ) : 
			this._getDate().setMonth( 0 );
	},
	_prevYear: function() {
		return this._getDate().addYears( -1, true );
	},
	_nextYear: function() {
		return this._getDate().addYears( 1, true );
	},
	
	//
	// View
	//
	_getContext: function() {
		return this.element.parents( ":jqmData(role='page')" );
	},
	_getPicker: function() {
		return this._getContext().siblings( ".datepicker-main-layer" ).children();
	},
	_getOverlay: function() {
		return this._getContext().siblings( ".datepicker-click-layer" );
	},
	_applyTheme: function() {
		var p = this._getPicker().parent();
		p.find( "a" ).attr( "href", "#" ).addClass( "ui-body-b" );
		p.find( "ul.datepicker-groups ul > li:first-child > a" ).addClass( "ui-corner-top" );
		p.find( "ul.datepicker-groups ul > li:last-child > a" ).addClass( "ui-corner-bottom" );
		p.find( "ul.datepicker-buttons a" ).addClass( "ui-corner-all" );
		p.find( "input" ).attr( "readonly", "readonly" ).addClass( "ui-shadow-inset" );
		p.find( ".datepicker-main" ).addClass( "ui-body-a ui-corner-all" );
		this._getOverlay().addClass( "ui-body-a" );	
	},
	_createView: function() {
		this.element.attr( "readonly", "readonly" );

		// Only a single datepicker per context.
		if( this._getPicker().size() === 0 ) {
			this._getContext().after( $( this._markup ).hide() );
			this._applyTheme();
		}
	},
	_updateView: function() {
		var date = this._getDate(),
		    p    = this._getPicker(),
		    l    = this.options.locale;

		if( this._isXDate( date ) ) {
			p.find( ".datepicker-year"  ).val( date.toString( "yyyy" ) );
			p.find( ".datepicker-month" ).val( date.toString( "MMM"  ) );
			p.find( ".datepicker-day"   ).val( date.toString( "dd"   ) );
			p.find( ".datepicker-date-formatted" ).text( this.localeString() );	
		}
		var locale = this._isValidLocale( l ) ? ( XDate.defaultLocale = l, XDate.locales[ l ] ) : {};

		p.find( ".datepicker-set"    ).text( locale.ok     || "Set"    );
		p.find( ".datepicker-cancel" ).text( locale.cancel || "Cancel" );
		p.css("margin-top", parseInt( $( window ).scrollTop(), 10 ) + 50 + "px");
	},
	_showView: function() {
		this._getOverlay()
			// semi-transparent overlay overlaps content completely
			.css({
				"opacity": 0.7,
				"height": this._getContext().height() + "px" 
			})
			// click layer catches all events and stops bubbling
			.bind( this._blockedEvents, function() {
				return false;
			})
			.show();
		
		this._getPicker().parent().show();
	},
	_hideView: function() {
		this._getOverlay().unbind( this._blockedEvents ).hide();
		this._getPicker().parent().hide();
	},
	_updateDateInput: function() {
		this.element.val( this.dateString() );
	}
});
