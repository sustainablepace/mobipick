/*
 * Mobi Pick - An Android-style datepicker widget for jQuery Mobile.
 * 
 * Created by Christoph Baudson.
 *
 * Please report issues at https://github.com/sustainablepace/mobipick/issues
 *
 * Version 0.7
 *
 * Licensed under MIT license, see MIT-license.txt
 */
$.widget( "sustainablepace.mobipick", $.mobile.widget, {
	options: {
		date		: null,
		dateFormat      : "yyyy-MM-dd",
		dateFormatMonth : "yyyy-MM",
		dateFormatYear  : "yyyy",
		locale          : "en",
		intlStdDate     : true
	},
	widgetEventPrefix: "mobipick",
	// See http://stackoverflow.com/questions/6577346/jquery-bind-all-events-on-object
	_blockedEvents: "tap, touchstart, touchmove, touchend, touchcancel, blur, focus, focusin, focusout, load, resize, scroll, unload, click, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, error",
	_markup: "<div class='mobipick-click-layer mobipick-overlay'></div><div class='mobipick-main-layer mobipick-overlay'><div class='mobipick-main'><div class='mobipick-date-formatted'>Date</div><ul class='mobipick-groups'><li><ul><li><a class='mobipick-next-day'>+</a></li><li><input type='text' class='mobipick-input mobipick-day' /></li><li><a class='mobipick-prev-day'>-</a></li></ul></li><li><ul><li><a class='mobipick-next-month'>+</a></li><li><input type='text' class='mobipick-input mobipick-month' /></li><li><a class='mobipick-prev-month'>-</a></li></ul></li><li><ul><li><a class='mobipick-next-year'>+</a></li><li><input type='text' class='mobipick-input mobipick-year' /></li><li><a class='mobipick-prev-year'>-</a></li></ul></li></ul><ul class='mobipick-buttons'><li><a class='mobipick-set'>Set</a></li><li><a class='mobipick-cancel'>Cancel</a></li></ul></div></div>",
	
	// Controller
	_getInstance: function() {
		return this.element.data( "mobipick" );
	},
	destroy: function() {
		this._close();
		this.element.unbind( "tap" );
		$.Widget.prototype.destroy.call( this );
	},
	_create: function() {
		this._initOptions();          // parses options
		this._createView();           // inserts markup into DOM
		this._bindInputClickEvent();  // bind click event to input
	},
	_initOptions: function() {
		var date    = this.element.val()         || this.options.date,
		    minDate = this.element.attr( "min" ) || this.options.minDate,
		    maxDate = this.element.attr( "max" ) || this.options.maxDate;

		if( date ) {
			this._setOption( "date", date );
		}
		// Min and max dates can be set in the markup.
		// See http://dev.w3.org/html5/markup/input.date.html
		if( maxDate ) {
			this._setOption( "maxDate", maxDate );
		}
		if( minDate ) {
			this._setOption( "minDate", minDate );
		}
		this._setOption( "locale", this.options.locale );
	},
	_bindInputClickEvent: function() {
		this.element.bind( "tap", $.proxy( 
			this._getInstance()._open, this 
		) );
	},
	_init: function() {
		// fill input field with default value
		if( this._isXDate( this._getDate() ) ) {
			this.updateDateInput();
		}
	},
	_open: function( evt ) {
		evt.stopImmediatePropagation();		
		var date = this._getDate();
		if( !this._isXDate( date ) ) {
			date = this._getInitialDate();
		}			
		this._setOption( "date", this._fitDate( date ) );
		this._setOption( "originalDate", this._getDate() );

		this._showView();
		this._updateView();
		this._bindEvents();
	},
	_bindEvents: function() {
		var self = this,
		    p    = this._getPicker();
		
		// Set and Cancel buttons
		p.find( ".mobipick-set"    ).unbind().bind( "tap", $.proxy( 
			this._getInstance()._confirmDate, this
		) );
		p.find( ".mobipick-cancel" ).unbind().bind( "tap", $.proxy( 
			this._getInstance()._cancelDate,  this 
		) );
		$( document )
			.unbind( "keyup", $.proxy( this._cancelDateOnEsc, this ) )
			.bind(   "keyup", $.proxy( this._cancelDateOnEsc, this ) );
		
		// +/- Buttons
		var selectorMap = {
			".mobipick-prev-day"   : "_prevDay",
			".mobipick-prev-month" : "_prevMonth",
			".mobipick-prev-year"  : "_prevYear",
			".mobipick-next-day"   : "_nextDay",
			".mobipick-next-month" : "_nextMonth",
			".mobipick-next-year"  : "_nextYear"
		};
		for( var selector in selectorMap ) {
			(function() {
				var handler = self[ selectorMap[ selector ] ];
				if( !$.isFunction( handler) ) {
					return;
				}
				p.find( selector ).unbind().bind( "tap", $.proxy( 
					function() {
						self._getInstance()._handleDate( handler );
						return false;
					}, self 
				));
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
		var proceed    = true,
		    dateDiff   = this._getDate().diffDays( this.options.originalDate ),
		    hasChanged = dateDiff !== 0 || this.element.val() === "";
		
		if( this.options.close && typeof this.options.close === "function" ) {
			proceed = this.options.close.call() !== false;
		}
		if( proceed && hasChanged ) {
			this._setOption( "originalDate", this._getDate() );
			this.updateDateInput();
			this.element.trigger("change");
		} else {
			this._setOption( "date", this.options.originalDate );
		}
		this._close();
		return false;
	},
	_cancelDate: function() {
		this._setOption( "date", this.options.originalDate );
		this._confirmDate();
		return false;
	},
	_cancelDateOnEsc: function( evt ) {
		if( evt.keyCode === 27 ) {
			this._cancelDate();
		}
	},
	_setOption: function( key, value ) {
		switch( key ) {
			case "date":
				var sanitized = this._sanitizeDate( value );
				this.options[ key ] = sanitized ? sanitized.toDate() : sanitized;
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
			case "intlStdDate":
				this.options[ key ] = !!value;
				break;
			case "locale":
				if( this._isValidLocale( value ) ) {
					this.options.locale = value;
				}
				break;
			default:
				// Do not update view!				
				return $.Widget.prototype._setOption.apply( this, arguments );
		}
		this._updateView();
	},
	//
	// Model
	//
	_sanitizeDate: function( d ) {
		var date = d;		
		if( date === null ) {
			return null;
		}
		if( typeof date === "string" ) {
			date = new XDate( date );
		}		
		if( this._isXDate( date ) ) {
			date = date.toDate();
		}
		if( !this._isDate( date ) ) {
			throw "Parameter 'date' must be a Date.";
		}
		return new XDate( 
			date.getFullYear(), date.getMonth(), date.getDate() 
		);
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
	_getDateFormat: function() {
		var a = "dateFormat";
		if( this.options.accuracy === "month" ) {
			a += "Month";
		} else if( this.options.accuracy === "year" ) {
			a += "Year";
		}
		return a;
	},
	dateString: function() {
		var a = this._getDateFormat();
		return this._getDate() ? this._getDate().toString( this.options[ a ] ) : '';
	},
	localeString: function() {
		var l = this.options.locale,
		    a = this._getDateFormat();
		
		return this._getDate() ? this._getDate().toString( 
			this._isValidLocale( l ) ? XDate.locales[ l ][ a ] : this.options[ a ]
		) : '';
	},
	_getInitialDate: function() {
		return new XDate();
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
		return this._getContext().siblings( ".mobipick-main-layer" ).children();
	},
	_getOverlay: function() {
		return this._getContext().siblings( ".mobipick-click-layer" );
	},
	_applyTheme: function() {
		var p = this._getPicker().parent();
		p.find( "a" )
			.attr( "href", "#" )
			.addClass( "ui-body-b" );
		p.find( "ul.mobipick-groups ul > li:first-child > a" )
			.addClass( "ui-corner-top" );
		p.find( "ul.mobipick-groups ul > li:last-child > a" )
			.addClass( "ui-corner-bottom" );
		p.find( "ul.mobipick-buttons a" )
			.addClass( "ui-corner-all" );
		p.find( "input" )
			.attr( "readonly", "readonly" )
			.addClass( "ui-shadow-inset" );
		p.find( ".mobipick-main" )
			.addClass( "ui-body-a ui-corner-all" );
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
			p.find( ".mobipick-year"  ).val( date.toString( "yyyy" ) );
			p.find( ".mobipick-month" ).val( date.toString( "MMM"  ) );
			p.find( ".mobipick-day"   ).val( date.toString( "dd"   ) );
			p.find( ".mobipick-date-formatted" ).text( this.localeString() );	
		}
		var locale = this._isValidLocale( l ) ? 
			( XDate.defaultLocale = l, XDate.locales[ l ] ) : {};

		p.find( ".mobipick-set"    ).text( locale.ok     || "Set"    );
		p.find( ".mobipick-cancel" ).text( locale.cancel || "Cancel" );
		p.css( "margin-top", parseInt( $( window ).scrollTop(), 10 ) + 50 + "px" );

		// Display items based on accuracy setting
		var columns  = p.find( ".mobipick-groups > li" )
			.removeClass( "mobipick-hide" )
			.addClass( "mobipick-inline-block" );
		
		if( this.options.accuracy === "month" ) {
			p.find( ".mobipick-groups > li:first-child" )
				.addClass( "mobipick-hide" )
				.removeClass( "mobipick-inline-block" );
			p.css( "width", "280px" );
		} else if( this.options.accuracy === "year" ) {
			p.find( ".mobipick-groups > li:last-child" ).siblings()
				.addClass( "mobipick-hide" )
				.removeClass( "mobipick-inline-block" );
			p.css( "width", "200px" );
		} else {
			p.css( "width", "300px" );
		}
		// minus 1% margin (left and right) per column
		var columnCount = columns.filter( ":visible" ).size(),
		    width       = ( ( 100 - columnCount * 2 * 1 ) / columnCount ) + "%";
		columns.css( "width", width );

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
	updateDateInput: function() {
		this.element.val( this.options.intlStdDate ? 
			this.dateString() : this.localeString() 
		);
	}
});
