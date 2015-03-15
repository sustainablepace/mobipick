(function($) {
    $.fn.extend({
        triggerAll: function (events, params) {
            var el = this, i, evts = events.split(' ');
            for (i = 0; i < evts.length; i += 1) {
                el.trigger(evts[i], params);
            }
            return el;
        }
    });
})(jQuery);
/**
 * Node should be a jQuery collection with a single element.
 */
function isSingleJQueryElement( node, msg ) {
	var actual = {
		type: typeof node.jquery,
		size: node.length
	};
	var expected = {
		type: "string",
		size: 1
	};
	QUnit.push( QUnit.equiv( actual, expected ), actual, expected, msg );
}
/**
 * Node should be a hidden jQuery collection.
 */
function isHidden( node, msg ) {
	var actual = node.css( "display" );
	var expected = "none";

	QUnit.push( QUnit.equiv( actual, expected ), actual, expected, msg );
}

module( "Mobi Pick", {
	setup: function() {
		this.$mp = $( "#mobipick" ).val( "" );
	},
	teardown: function() {
		$( "#mobipick" ).mobipick( "destroy" );
	},
	selectDatepickerItems: function() {
      var ctx = this.$mp.data( "sustainablepaceMobipick" )._picker;
	    this.$set        = $( ".mobipick-set", ctx );
	    this.$cancel     = $( ".mobipick-cancel", ctx );
	    this.$prevDay    = $( ".mobipick-prev-day", ctx );
	    this.$day        = $( ".mobipick-day", ctx );
	    this.$nextDay    = $( ".mobipick-next-day", ctx );
	    this.$prevMonth  = $( ".mobipick-prev-month", ctx );
	    this.$month      = $( ".mobipick-month", ctx );
	    this.$nextMonth  = $( ".mobipick-next-month", ctx );
	    this.$prevYear   = $( ".mobipick-prev-year", ctx );
	    this.$year       = $( ".mobipick-year", ctx );
	    this.$nextYear   = $( ".mobipick-next-year", ctx );
	}
} );

test( "Check if Mobi Pick returns the jQuery collection", function() {
	this.$mp.mobipick();
	isSingleJQueryElement( this.$mp  );
	deepEqual( this.$mp.get( 0 ).tagName.toUpperCase(), "INPUT" );
});

test( "Mobi Pick opens on tap", function() {
	this.$mp.mobipick().trigger( "tap" );
	
	this.selectDatepickerItems();

	isSingleJQueryElement( this.$prevDay );
	isSingleJQueryElement( this.$day     );
	isSingleJQueryElement( this.$nextDay );

	isSingleJQueryElement( this.$prevMonth );
	isSingleJQueryElement( this.$month     );
	isSingleJQueryElement( this.$nextMonth );

	isSingleJQueryElement( this.$prevYear );
	isSingleJQueryElement( this.$year     );
	isSingleJQueryElement( this.$nextYear );
	    
	isSingleJQueryElement( this.$set    );
	isSingleJQueryElement( this.$cancel );
});

test( "Defaults are current date and english", function() {
	this.$mp.mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	var date  = new Date(),
	    year  = date.getFullYear(),
	    month = XDate.locales[ 'en' ].monthNamesShort[ date.getMonth() ],
	    day   = date.getDate();

	deepEqual( parseInt( this.$year.val(), 10 ),  year,  "Must be current date." );
	deepEqual( this.$month.val(), month, "Must be current date." );
	deepEqual( parseInt( this.$day.val(), 10 ),   day,   "Must be current date." );
});

test( "Default date", function() {
	this.$mp.val( "2008-10-17" ).mobipick();

	var date         = new Date( 2008, 9, 17 ),
	    mobipickDate = this.$mp.mobipick( "option", "date" );

	deepEqual( mobipickDate.constructor, Date, "Returns Date object." );
	deepEqual( date.getFullYear(), mobipickDate.getFullYear() );
	deepEqual( date.getMonth(), mobipickDate.getMonth() );
	deepEqual( date.getDate(), mobipickDate.getDate() );
});

test( "Change to previous date", function() {
	this.$mp.val( "2008-10-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$prevDay.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevYear.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2007, 8, 16 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to next date", function() {
	this.$mp.val( "2008-10-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$nextDay.trigger( "tap" );
	this.$nextMonth.trigger( "tap" );
	this.$nextYear.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2009, 10, 18 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to next month Dec", function() {
	this.$mp.val( "2008-12-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$nextMonth.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2008, 0, 17 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to next month Overflow", function() {
	this.$mp.val( "2013-01-31" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$nextMonth.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2013, 1, 28 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to next day leap year", function() {
	this.$mp.val( "2012-02-28" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$nextDay.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2012, 1, 29 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to next day no leap year", function() {
	this.$mp.val( "2013-02-28" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$nextDay.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2013, 1, 1 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to prev day new year", function() {
	this.$mp.val( "2012-01-01" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$prevDay.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2012, 0, 31 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to next day new years eve", function() {
	this.$mp.val( "2012-12-31" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$nextDay.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2012, 11, 1 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to prev day leap year", function() {
	this.$mp.val( "2012-02-01" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$prevDay.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2012, 1, 29 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to prev day no leap year", function() {
	this.$mp.val( "2013-02-01" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$prevDay.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2013, 1, 28 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to prev month Jan", function() {
	this.$mp.val( "2008-01-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$prevMonth.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2008, 11, 17 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Change to 11 prev month Jan", function() {
	this.$mp.val( "2008-01-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2008, 1, 17 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Accuracy (month)", function() {
	this.$mp.val( "2010-10" ).mobipick({
		accuracy: "month"
	}).trigger( "tap" );

	this.selectDatepickerItems();

	isHidden( this.$prevDay.parent().parent().parent()  );
	isHidden( this.$day.parent().parent().parent()  );
	isHidden( this.$nextDay.parent().parent().parent()  );

	var date   = new Date(2010, 9, 1),
	    month  = XDate.locales[ 'en' ].monthNames[ date.getMonth() ],
		year   = date.getFullYear(),
		actual = this.$mp.mobipick( "localeString" );
		
	deepEqual( actual, month + " " + year );
	
	this.$set.trigger( "tap" );
	var selectedDate = this.$mp.mobipick( "option", "date" );
	deepEqual( selectedDate.getFullYear(), year );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Accuracy (month, no default)", function() {
	this.$mp.mobipick({
		accuracy: "month"
	}).trigger( "tap" );

	this.selectDatepickerItems();

	this.$set.trigger( "tap" );

	var date         = new Date(),
	    selectedDate = this.$mp.mobipick( "option", "date" );
	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Accuracy (year)", function() {
	this.$mp.val( "2000" ).mobipick({
		accuracy: "year"
	}).trigger( "tap" );

	this.selectDatepickerItems(this.$mp);

	isHidden( this.$prevDay.parent().parent().parent()  );
	isHidden( this.$day.parent().parent().parent()  );
	isHidden( this.$nextDay.parent().parent().parent()  );

	isHidden( this.$prevMonth.parent().parent().parent()  );
	isHidden( this.$month.parent().parent().parent()  );
	isHidden( this.$nextMonth.parent().parent().parent()  );

	var date   = new Date(2000, 0, 1),
		actual = this.$mp.mobipick( "localeString" );
		
	deepEqual( actual, date.getFullYear().toString() );
	
	this.$set.trigger( "tap" );
	var selectedDate = this.$mp.mobipick( "option", "date" );
	deepEqual( selectedDate.getFullYear(), date.getFullYear() );
	deepEqual( selectedDate.getMonth(), date.getMonth() );
	deepEqual( selectedDate.getDate(), date.getDate() );
});

test( "Default date (programmatically)", function() {
	this.$mp.mobipick({
		date: "2008-10-17"
	}).trigger( "tap" );

	this.selectDatepickerItems();
	this.$set.trigger( "tap" );

	deepEqual( "2008-10-17", this.$mp.val() );
});

test( "Issue #4", function() {
	this.$mp.mobipick().trigger( "tap" );

	this.selectDatepickerItems();
	this.$set.trigger( "tap" );

	var date = new Date();

	deepEqual( date.toISOString().substr(0, 10), this.$mp.val() );
});

test( "Human readable", function() {
	this.$mp.mobipick({
		intlStdDate: false,
		date: "2008-10-17"
	}).trigger( "tap" );

	this.selectDatepickerItems();
	this.$set.trigger( "tap" );

	deepEqual( "Friday, October 17, 2008", this.$mp.val() );
});

test( "Dynamic min date", function() {
	var minDate = (new XDate()).addDays( 4 );
	this.$mp.mobipick({
		minDate: minDate
	}).trigger( "tap" );

	this.selectDatepickerItems();

	var actualDate = this.$mp.mobipick( "option", "date" );
	deepEqual( actualDate.getFullYear(), minDate.getFullYear() );
	deepEqual( actualDate.getMonth(),    minDate.getMonth() );
	deepEqual( actualDate.getDate(),     minDate.getDate() );
	this.$prevDay.trigger( "tap" );
	deepEqual( actualDate.getFullYear(), minDate.getFullYear() );
	deepEqual( actualDate.getMonth(),    minDate.getMonth() );
	deepEqual( actualDate.getDate(),     minDate.getDate() );
});
test( "Dynamic max date", function() {
	var maxDate = (new XDate()).addDays( -4 );
	this.$mp.mobipick({
		maxDate: maxDate
	}).trigger( "tap" );

	this.selectDatepickerItems();

	var actualDate = this.$mp.mobipick( "option", "date" );
	deepEqual( actualDate.getFullYear(), maxDate.getFullYear() );
	deepEqual( actualDate.getMonth(),    maxDate.getMonth() );
	deepEqual( actualDate.getDate(),     maxDate.getDate() );
	this.$nextDay.trigger( "tap" );
	deepEqual( actualDate.getFullYear(), maxDate.getFullYear() );
	deepEqual( actualDate.getMonth(),    maxDate.getMonth() );
	deepEqual( actualDate.getDate(),     maxDate.getDate() );
});
test( "Reset date", function() {
	var p = this.$mp.mobipick();
	var initialDate = p.mobipick( "option", "date" );
	deepEqual(initialDate, null);
	deepEqual(p.val(), "");
	p.mobipick("option", "date", new Date());
	var date = p.mobipick("option", "date");
	ok( date instanceof Date);
	deepEqual(p.val(), "");
	p.mobipick("updateDateInput");
	notEqual(p.val(), "");
	p.mobipick("option", "date", null);
	var date = p.mobipick("option", "date");
	deepEqual( date, null);
	notEqual(p.val(), "");
	p.mobipick("updateDateInput");
	deepEqual(p.val(), "");
});
test( "Reinitialize", function() {
	var p = this.$mp.mobipick();
	var initialDate = p.mobipick( "option", "date" );
	deepEqual(initialDate, null);
	p.mobipick("option", "date", new Date());
	var date = p.mobipick("option", "date");
	ok( date instanceof Date);
	
	p.mobipick("destroy").mobipick();
	var date = p.mobipick("option", "date");
	deepEqual( date, null);
});
test( "Pull 11", function() {
	var p = this.$mp.mobipick().trigger( "tap" );
	this.selectDatepickerItems();
	this.$cancel.trigger( "tap" );
	
	deepEqual( "", this.$mp.val() );
});
test( "inputOrder default", function() {
	var p = this.$mp.mobipick().trigger( "tap" );
	this.selectDatepickerItems();
	ok(/mobipick-day.*mobipick-month.*mobipick-year/.test(
		p.data("sustainablepaceMobipick")._picker[0].innerHTML
	));
	this.$cancel.trigger( "tap" );
});
test( "inputOrder ISO 8601", function() {
	var p = this.$mp.mobipick({
		inputOrder: "y m d"
	}).trigger( "tap" );
	this.selectDatepickerItems();
	ok(/mobipick-year.*mobipick-month.*mobipick-day/.test(
		p.data("sustainablepaceMobipick")._picker[0].innerHTML
	));
	this.$cancel.trigger( "tap" );
});

asyncTest( "issue 6", function() {
	expect( 1 );
	var p = this.$mp.mobipick(),
		i = $( "<input type='text' />" ).css({
			position: "absolute",
			top: 0,
			left: 0,
			width: "10000px",
			height: "10000px"
		}),
		self = this;
	$("#qunit-tests").after( i );
	// This is the only assertion that should be run.
	ok ( true );
	i.on( "tap click", function() {
		// If this "tap" event handler is fired, the test fails (1 != 2).
		ok( true );
	});
	$(window).scrollTop(5000);
	window.setTimeout( function() {
		p.trigger( "tap" );
	}, 2000 );
	window.setTimeout( function() {
		self.selectDatepickerItems();
		self.$prevDay.triggerAll( "click tap" );
		self.$set.triggerAll( "click tap" );
	}, 4000 );
	window.setTimeout( function() {
		i.remove();
		start();
	}, 6000 );
});

