/**
 * Node should be a jQuery collection with a single element.
 */
function isSingleJQueryElement( node, msg ) {
	var actual = {
		type: typeof node.jquery,
		size: node.size()
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
		this.$dp = $( "#mobipick" );
	},
	teardown: function() {
		$( "#mobipick" ).mobipick( "destroy" );
	},
	selectDatepickerItems: function() {
	    this.$mainLayer  = $( ".datepicker-main-layer" );
	    this.$clickLayer = $( ".datepicker-click-layer" );
	    this.$set        = $( ".datepicker-set" );
	    this.$cancel     = $( ".datepicker-cancel" );
	    this.$prevDay    = $( ".datepicker-prev-day" );
	    this.$day        = $( ".datepicker-day" );
	    this.$nextDay    = $( ".datepicker-next-day" );
	    this.$prevMonth  = $( ".datepicker-prev-month" );
	    this.$month      = $( ".datepicker-month" );
	    this.$nextMonth  = $( ".datepicker-next-month" );
	    this.$prevYear   = $( ".datepicker-prev-year" );
	    this.$year       = $( ".datepicker-year" );
	    this.$nextYear   = $( ".datepicker-next-year" );
	}
} );
test( "Check if Mobi Pick returns the jQuery collection", function() {
	this.$dp.mobipick();
	same( this.$dp.jquery, "1.6.4", "Mobi Pick returns jQuery collection" );
	same( this.$dp.size(), 1, "Mobi Pick returns jQuery collection of size one" );
	same( this.$dp.get( 0 ).tagName.toUpperCase(), "INPUT", "Mobi Pick returns jQuery collection of one input." );
});

test( "Mobi Pick is not opened before tap", function() {
	this.$dp.mobipick();
	
	this.selectDatepickerItems();

	isSingleJQueryElement( this.$mainLayer  );
	isSingleJQueryElement( this.$clickLayer );
	isHidden( this.$mainLayer  );
	isHidden( this.$clickLayer );

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

test( "Mobi Pick opens on tap", function() {
	this.$dp.mobipick().trigger( "tap" );
	
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

test( "Mobi Pick uses current date if no default date is given, names are in english", function() {
	this.$dp.mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	var date         = new Date();
	same( this.$year.val(),  date.getFullYear().toString(), "If no default date is given, use current date." );
	same( this.$month.val(), XDate.locales['en'].monthNamesShort[ date.getMonth() ], "If no default date is given, use current date." );
	same( this.$day.val(),   date.getDate().toString(), "If no default date is given, use current date." );
});

test( "Check default date", function() {
	this.$dp.attr( "value", "2008-10-17" ).mobipick();

	var date         = new Date( 2008, 9, 17 ),
	    mobipickDate = this.$dp.mobipick( "option", "date" );

	same( mobipickDate.constructor, Date, "Option 'date' returns Date object." );
	same( date.getFullYear(), mobipickDate.getFullYear(), "If no default date is given, use current date." );
	same( date.getMonth(), mobipickDate.getMonth(), "If no default date is given, use current date." );
	same( date.getDate(), mobipickDate.getDate(), "If no default date is given, use current date." );
});

test( "Change date prev", function() {
	this.$dp.attr( "value", "2008-10-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();
	this.$prevDay.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevYear.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2007, 8, 16 );
	var selectedDate = this.$dp.mobipick( "option", "date" );

	same( selectedDate.getFullYear(), date.getFullYear(), "Date has been modified." );
	same( selectedDate.getMonth(), date.getMonth(), "Date has been modified." );
	same( selectedDate.getDate(), date.getDate(), "Date has been modified." );
});

test( "Change date next", function() {
	this.$dp.attr( "value", "2008-10-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();
	this.$nextDay.trigger( "tap" );
	this.$nextMonth.trigger( "tap" );
	this.$nextYear.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2009, 10, 18 );
	var selectedDate = this.$dp.mobipick( "option", "date" );

	same( selectedDate.getFullYear(), date.getFullYear(), "Date has been modified." );
	same( selectedDate.getMonth(), date.getMonth(), "Date has been modified." );
	same( selectedDate.getDate(), date.getDate(), "Date has been modified." );
});


