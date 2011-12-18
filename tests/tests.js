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

/**
 * Node should be a visible jQuery collection.
 */
function isNotHidden( node, msg ) {
	var actual = node.css( "display" );
	var expected = "block";

	QUnit.push( QUnit.equiv( actual, expected ), actual, expected, msg );
}

module( "Mobi Pick", {
	setup: function() {
		this.$mp = $( "#mobipick" );
	},
	teardown: function() {
		$( "#mobipick" ).mobipick( "destroy" );
	},
	selectDatepickerItems: function() {
	    this.$mainLayer  = $( ".mobipick-main-layer" );
	    this.$clickLayer = $( ".mobipick-click-layer" );
	    this.$set        = $( ".mobipick-set" );
	    this.$cancel     = $( ".mobipick-cancel" );
	    this.$prevDay    = $( ".mobipick-prev-day" );
	    this.$day        = $( ".mobipick-day" );
	    this.$nextDay    = $( ".mobipick-next-day" );
	    this.$prevMonth  = $( ".mobipick-prev-month" );
	    this.$month      = $( ".mobipick-month" );
	    this.$nextMonth  = $( ".mobipick-next-month" );
	    this.$prevYear   = $( ".mobipick-prev-year" );
	    this.$year       = $( ".mobipick-year" );
	    this.$nextYear   = $( ".mobipick-next-year" );
	}
} );

test( "Check if Mobi Pick returns the jQuery collection", function() {
	this.$mp.mobipick();

	isSingleJQueryElement( this.$mp  );
	same( this.$mp.get( 0 ).tagName.toUpperCase(), "INPUT" );
});

test( "Mobi Pick is not opened before tap", function() {
	this.$mp.mobipick();
	
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
	isNotHidden( this.$mainLayer  );
	isNotHidden( this.$clickLayer );
});

test( "Defaults are current date and english", function() {
	this.$mp.mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	var date  = new Date(),
	    year  = date.getFullYear().toString(),
	    month = XDate.locales[ 'en' ].monthNamesShort[ date.getMonth() ],
	    day   = date.getDate().toString();

	same( this.$year.val(),  year,  "Must be current date." );
	same( this.$month.val(), month, "Must be current date." );
	same( this.$day.val(),   day,   "Must be current date." );
});

test( "Default date", function() {
	this.$mp.attr( "value", "2008-10-17" ).mobipick();

	var date         = new Date( 2008, 9, 17 ),
	    mobipickDate = this.$mp.mobipick( "option", "date" );

	same( mobipickDate.constructor, Date, "Returns Date object." );
	same( date.getFullYear(), mobipickDate.getFullYear() );
	same( date.getMonth(), mobipickDate.getMonth() );
	same( date.getDate(), mobipickDate.getDate() );
});

test( "Change to previous date", function() {
	this.$mp.attr( "value", "2008-10-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$prevDay.trigger( "tap" );
	this.$prevMonth.trigger( "tap" );
	this.$prevYear.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2007, 8, 16 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	same( selectedDate.getFullYear(), date.getFullYear() );
	same( selectedDate.getMonth(), date.getMonth() );
	same( selectedDate.getDate(), date.getDate() );
});

test( "Change to next date", function() {
	this.$mp.attr( "value", "2008-10-17" ).mobipick().trigger( "tap" );

	this.selectDatepickerItems();

	this.$nextDay.trigger( "tap" );
	this.$nextMonth.trigger( "tap" );
	this.$nextYear.trigger( "tap" );
	this.$set.trigger( "tap" );

	var date         = new Date( 2009, 10, 18 );
	var selectedDate = this.$mp.mobipick( "option", "date" );

	same( selectedDate.getFullYear(), date.getFullYear() );
	same( selectedDate.getMonth(), date.getMonth() );
	same( selectedDate.getDate(), date.getDate() );
});


