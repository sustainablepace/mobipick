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
		this.$mp = $( "#mobipick" ).val( "" );
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

	same( parseInt( this.$year.val(), 10 ),  year,  "Must be current date." );
	same( this.$month.val(), month, "Must be current date." );
	same( parseInt( this.$day.val(), 10 ),   day,   "Must be current date." );
});

test( "Default date", function() {
	this.$mp.val( "2008-10-17" ).mobipick();

	var date         = new Date( 2008, 9, 17 ),
	    mobipickDate = this.$mp.mobipick( "option", "date" );

	same( mobipickDate.constructor, Date, "Returns Date object." );
	same( date.getFullYear(), mobipickDate.getFullYear() );
	same( date.getMonth(), mobipickDate.getMonth() );
	same( date.getDate(), mobipickDate.getDate() );
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

	same( selectedDate.getFullYear(), date.getFullYear() );
	same( selectedDate.getMonth(), date.getMonth() );
	same( selectedDate.getDate(), date.getDate() );
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

	same( selectedDate.getFullYear(), date.getFullYear() );
	same( selectedDate.getMonth(), date.getMonth() );
	same( selectedDate.getDate(), date.getDate() );
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
		
	same( actual, month + " " + year );
	
	this.$set.trigger( "tap" );
	var selectedDate = this.$mp.mobipick( "option", "date" );
	same( selectedDate.getFullYear(), year );
	same( selectedDate.getMonth(), date.getMonth() );
	same( selectedDate.getDate(), date.getDate() );
});

test( "Accuracy (month, no default)", function() {
	this.$mp.mobipick({
		accuracy: "month"
	}).trigger( "tap" );

	this.selectDatepickerItems();

	this.$set.trigger( "tap" );

	var date         = new Date(),
	    selectedDate = this.$mp.mobipick( "option", "date" );
	same( selectedDate.getFullYear(), date.getFullYear() );
	same( selectedDate.getMonth(), date.getMonth() );
	same( selectedDate.getDate(), date.getDate() );
});

test( "Accuracy (year)", function() {
	this.$mp.val( "2000" ).mobipick({
		accuracy: "year"
	}).trigger( "tap" );

	this.selectDatepickerItems();

	isHidden( this.$prevDay.parent().parent().parent()  );
	isHidden( this.$day.parent().parent().parent()  );
	isHidden( this.$nextDay.parent().parent().parent()  );

	isHidden( this.$prevMonth.parent().parent().parent()  );
	isHidden( this.$month.parent().parent().parent()  );
	isHidden( this.$nextMonth.parent().parent().parent()  );

	var date   = new Date(2000, 0, 1),
		actual = this.$mp.mobipick( "localeString" );
		
	same( actual, date.getFullYear().toString() );
	
	this.$set.trigger( "tap" );
	var selectedDate = this.$mp.mobipick( "option", "date" );
	same( selectedDate.getFullYear(), date.getFullYear() );
	same( selectedDate.getMonth(), date.getMonth() );
	same( selectedDate.getDate(), date.getDate() );
});

test( "Default date (programmatically)", function() {
	this.$mp.mobipick({
		date: "2008-10-17"
	}).trigger( "tap" );

	this.selectDatepickerItems();
	this.$set.trigger( "tap" );

	same( "2008-10-17", this.$mp.val() );
});

test( "Issue #4", function() {
	this.$mp.mobipick().trigger( "tap" );

	this.selectDatepickerItems();
	this.$set.trigger( "tap" );

	var date = new Date();

	same( date.toISOString().substr(0, 10), this.$mp.val() );
});

test( "Human readable", function() {
	this.$mp.mobipick({
		intlStdDate: false,
		date: "2008-10-17"
	}).trigger( "tap" );

	this.selectDatepickerItems();
	this.$set.trigger( "tap" );

	same( "Friday, October 17, 2008", this.$mp.val() );
});

test( "Dynamic min date", function() {
	var minDate = (new XDate()).addDays( 4 );
	this.$mp.mobipick({
		minDate: minDate
	}).trigger( "tap" );

	this.selectDatepickerItems();

	var actualDate = this.$mp.mobipick( "option", "date" );
	same( actualDate.getFullYear(), minDate.getFullYear() );
	same( actualDate.getMonth(),    minDate.getMonth() );
	same( actualDate.getDate(),     minDate.getDate() );
	this.$prevDay.trigger( "tap" );
	same( actualDate.getFullYear(), minDate.getFullYear() );
	same( actualDate.getMonth(),    minDate.getMonth() );
	same( actualDate.getDate(),     minDate.getDate() );
});
test( "Dynamic max date", function() {
	var maxDate = (new XDate()).addDays( -4 );
	this.$mp.mobipick({
		maxDate: maxDate
	}).trigger( "tap" );

	this.selectDatepickerItems();

	var actualDate = this.$mp.mobipick( "option", "date" );
	same( actualDate.getFullYear(), maxDate.getFullYear() );
	same( actualDate.getMonth(),    maxDate.getMonth() );
	same( actualDate.getDate(),     maxDate.getDate() );
	this.$nextDay.trigger( "tap" );
	same( actualDate.getFullYear(), maxDate.getFullYear() );
	same( actualDate.getMonth(),    maxDate.getMonth() );
	same( actualDate.getDate(),     maxDate.getDate() );
});
test( "Reset date", function() {
	var p = this.$mp.mobipick();
	var initialDate = p.mobipick( "option", "date" );
	same(initialDate, null);
	same(p.val(), "");
	p.mobipick("option", "date", new Date());
	var date = p.mobipick("option", "date");
	ok( date instanceof Date);
	same(p.val(), "");
	p.mobipick("updateDateInput");
	notEqual(p.val(), "");
	p.mobipick("option", "date", null);
	var date = p.mobipick("option", "date");
	same( date, null);
	notEqual(p.val(), "");
	p.mobipick("updateDateInput");
	same(p.val(), "");
});
test( "Reinitialize", function() {
	var p = this.$mp.mobipick();
	var initialDate = p.mobipick( "option", "date" );
	same(initialDate, null);
	p.mobipick("option", "date", new Date());
	var date = p.mobipick("option", "date");
	ok( date instanceof Date);
	
	p.mobipick("destroy").mobipick();
	var date = p.mobipick("option", "date");
	same( date, null);
});
test("Issue 6", function() {
	var i = 0;
	var button = $("<button></button>").text("Large button").css({
		width: "1000px",
		height: "1000px"
	}).bind("tap", function() {
		i++;
		alert("!");
	});
	$("#qunit-tests").after(button);
	$(window).scrollTop(10000);

	this.$mp.mobipick().trigger( "tap" );
	this.selectDatepickerItems();
	this.$nextDay.trigger( "tap" );
	
	same(i, 0);
});
