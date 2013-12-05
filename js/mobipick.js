/*
 * Mobi Pick - An Android-style datepicker widget for jQuery Mobile.
 *
 * Created by Christoph Baudson.
 *
 * Please report issues at https://github.com/sustainablepace/mobipick/issues
 *
 * Version 0.9
 *
 * Licensed under MIT license, see MIT-license.txt
 */
( function( $, undefined ){
$.widget( "sustainablepace.mobipick", $.mobile.widget, {
	options: {
		date            : null,
		dateFormat      : "yyyy-MM-dd",
		dateFormatMonth : "yyyy-MM",
		dateFormatYear  : "yyyy",
		locale          : "en",
		intlStdDate     : true,
		buttonTheme     : "b",
		popup           : {
			dismissible: false,
			history: false,
			overlayTheme: "a",
			positionTo: "window",
			theme: "a",
			transition: "none"
		}
	},
	// Controller
	_picker: $( [] ),
	widgetEventPrefix: "mobipick",
	destroy: function() {
		this._close();
		this.element.off( "tap click" );
		this._picker.popup( "destroy" );
		$.Widget.prototype.destroy.call( this );
	},
	_create: function() {
		this._initOptions();          // parses options
		this._createView();           // inserts markup into DOM
		this.element.on( "tap click", $.proxy( this.open, this ) );
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
	_init: function() {
		// fill input field with default value
		if( this._getDate() !== null ) {
			this.updateDateInput();
		}
	},
	open: function( evt ) {
        if( evt ) {
            evt.stopPropagation();
            evt.preventDefault();
        }
		var date = this._getDate();
		if( !this._isXDate( date ) ) {
			date = new XDate();
		}
		this._setOption( "date",         this._fitDate( date ) );
		this._setOption( "originalDate", this._getDate()       );

		this._showView();
		this._updateView();
		this._bindEvents();
	},
	_bindEvents: function() {
		var self    = this,
		    p       = this._picker,
		    confirm = $.proxy( this._confirmDate,     this ),
		    cancel  = $.proxy( this._cancelDate,      this ),
		    esc     = $.proxy( this._cancelDateOnEsc, this );

		// Set and Cancel buttons
		p.find( ".mobipick-set"    ).off().on( "tap", confirm );
		p.find( ".mobipick-cancel" ).off().on( "tap", cancel  );
		$( document ).off( "keyup", esc ).on( "keyup", esc );

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
				p.find( selector ).off().on( "tap", $.proxy( function() {
					return self._handleDate( handler );
				}, self ));
			})();
		}
	},
	_close: function() {
		this._hideView();
	},
	_handleDate: function( dateHandler ) {
		this._setOption( "date", this._fitDate( dateHandler.apply( this ) ) );
		return false;
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
		this._close();
		return false;
	},
	_cancelDateOnEsc: function( evt ) {
		if( evt.keyCode === 27 ) {
			this._cancelDate();
		}
	},
	_setOption: function( key, val ) {
		switch( key ) {
			case "date":
				var sane = this._sanitizeDate( val );
				this.options[ key ] = sane ? sane.toDate() : sane;
				break;
			case "originalDate":
				this.options[ key ] = this._sanitizeDate( val ).toDate();
				break;
			case "maxDate":
				this.options[ key ] = this._sanitizeMaxDate( val ).toDate();
				break;
			case "minDate":
				this.options[ key ] = this._sanitizeMinDate( val ).toDate();
				break;
			case "intlStdDate":
				this.options[ key ] = !!val;
				break;
			case "locale":
				this.options[ key ] = this._isValidLocale( val ) ? val : "en";
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
	_sanitizeDate: function( date ) {
		if( date === null ) {
			return null;
		}
		var d = date;
		if( typeof d === "string" ) {
			d = new XDate( d );
		}
		if( this._isXDate( d ) ) {
			d = d.toDate();
		}
		if( !this._isDate( d ) ) {
			throw "Parameter 'date' must be a Date.";
		}
		return new XDate( d.getFullYear(), d.getMonth(), d.getDate() );
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
		switch( this.options.accuracy ) {
			case "month":
				return "dateFormatMonth";
			case "year":
				return "dateFormatYear";
			default:
				return "dateFormat";
		}
	},
	dateString: function() {
		var format = this._getDateFormat(),
		    date   = this._getDate();
		return !date ? '' : date.toString( this.options[ format ] );
	},
	localeString: function() {
		var l    = this.options.locale,
		    a    = this._getDateFormat(),
		    date = this._getDate();

		return !date ? '' : date.toString(
			this._isValidLocale( l ) ? XDate.locales[ l ][ a ] : this.options[ a ]
		);
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
	_isValidLocale: function( l ) {
		return typeof l === "string" && XDate.locales && XDate.locales[ l ];
	},
	_isDate: function( d ) {
		return typeof d === "object" && d !== null && d.constructor === Date;
	},
	_isXDate: function( x ) {
		return typeof x === "object" && x !== null && x.constructor === XDate;
	},
	_getMaxDate: function() {
		var maxDate = this.options.maxDate;
		return this._isDate( maxDate ) ? new XDate( maxDate ) : null;
	},
	_getMinDate: function() {
		var minDate = this.options.minDate;
		return this._isDate( minDate ) ? new XDate( minDate ) : null;
	},
	_getDate: function() {
		var date = this.options.date;
		return this._isDate( date ) ? new XDate( date ) : null;
	},
	_prevDay: function() {
		return this._addDay( -1 );
	},
	_nextDay: function() {
		return this._addDay( 1 );
	},
	_prevMonth: function() {
		return this._addMonth( -1 );
	},
	_nextMonth: function() {
		return this._addMonth( 1 );
	},
	_prevYear: function() {
		return this._addYear( -1 );
	},
	_nextYear: function() {
		return this._addYear( 1 );
	},
	_addYear: function( y ) {
		return this._getDate().addYears( y, true );
	},
	_addMonth: function( m ) {
		var date     = this._getDate(),
		    month    = date.getMonth(),
		    newMonth = ( 12 + month + m ) % 12;
		return date.setMonth( newMonth, true );
	},
	_addDay: function( d ) {
		var dt = this._getDate(),
		    n  = XDate.getDaysInMonth( dt.getFullYear(), dt.getMonth() );
		return dt.setDate( ( dt.getDate() - 1 + n + d ) % n + 1 );
	},

	//
	// View
	//
	_markup: "<div class='mobipick-main'><div class='mobipick-date-formatted'>Date</div><ul class='mobipick-groups'><li><ul><li><a class='mobipick-next-day'>+</a></li><li><input type='text' class='mobipick-input mobipick-day' /></li><li><a class='mobipick-prev-day'>-</a></li></ul></li><li><ul><li><a class='mobipick-next-month'>+</a></li><li><input type='text' class='mobipick-input mobipick-month' /></li><li><a class='mobipick-prev-month'>-</a></li></ul></li><li><ul><li><a class='mobipick-next-year'>+</a></li><li><input type='text' class='mobipick-input mobipick-year' /></li><li><a class='mobipick-prev-year'>-</a></li></ul></li></ul><ul class='mobipick-buttons'><li><a class='mobipick-set'>Set</a></li><li><a class='mobipick-cancel'>Cancel</a></li></ul></div>",
	_applyTheme: function() {
		var p       = this._picker,
		    buttons = {
		        "bottom": "ul.mobipick-groups ul > li:first-child > a",
		        "top":    "ul.mobipick-groups ul > li:last-child > a"
		    };

		for( var key in buttons ) {
			p.find( buttons[ key ] ).addClass( "ui-corner-all" )
				.css( "border-" + key + "-left-radius", "0")
				.css( "border-" + key + "-right-radius", "0");
		}
		p.addClass( "ui-body-" + this.options.popup.theme + " ui-corner-all" );
		p.find( "a" ).attr( "href", "#" )
			.addClass( "ui-body-" + this.options.buttonTheme );
		p.find( "ul.mobipick-buttons a" ).addClass( "ui-corner-all" );
		p.find( "input" )
			.attr( "readonly", "readonly" ).addClass( "ui-shadow-inset" );
	},
	_createView: function() {
		this.element.attr( "readonly", "readonly" );
		this._picker = $( this._markup ).popup( this.options.popup );
		$.data( this.element, "mobipick", this );
		this._applyTheme();
	},
	_updateView: function() {
		var date = this._getDate(),
		    p    = this._picker;

		if( this._isXDate( date ) ) {
			p.find( ".mobipick-year"  ).val( date.toString( "yyyy" ) );
			p.find( ".mobipick-month" ).val( date.toString( "MMM"  ) );
			p.find( ".mobipick-day"   ).val( date.toString( "dd"   ) );
			p.find( ".mobipick-date-formatted" ).text( this.localeString() );
		}
		var locale = {};
		if( this._isValidLocale( this.options.locale ) ) {
			XDate.defaultLocale = this.options.locale;
			locale = XDate.locales[ this.options.locale ];
		}

		p.find( ".mobipick-set"    ).text( locale.ok     || "Set"    );
		p.find( ".mobipick-cancel" ).text( locale.cancel || "Cancel" );

		// Display items based on accuracy setting
		var columns = p.find( ".mobipick-groups > li" )
			.removeClass( "mobipick-hide" )
			.addClass( "mobipick-inline-block" );

		if( this.options.accuracy === "month" ) {
			p.css( "max-width", "280px" )
				.find( ".mobipick-groups > li:first-child" )
				.addClass( "mobipick-hide" )
				.removeClass( "mobipick-inline-block" );
		} else if( this.options.accuracy === "year" ) {
			p.css( "max-width", "200px" )
				.find( ".mobipick-groups > li:last-child" )
				.siblings().addClass( "mobipick-hide" )
				.removeClass( "mobipick-inline-block" );
		} else {
			p.css( "max-width", "300px" );
		}
		// minus 1% margin (left and right) per column
		var columnCount = columns.filter( ":visible" ).size(),
		    width       = ( ( 100 - columnCount * 2 ) / columnCount ) + "%";
		columns.css( "width", width );
	},
	_showView: function() {
		this._picker.show().popup("open").focus();
	},
	_hideView: function() {
		this._picker.popup("close");
	},
	updateDateInput: function() {
		this.element.val( this.options.intlStdDate ?
			this.dateString() : this.localeString()
		);
	}
});
}( jQuery ) );
