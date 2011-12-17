module( "Basic setting" );
test( "Check if Mobi Pick returns the jQuery collection", function() {
	var $dp = $( "#mobipick" ).mobipick();
	same( $dp.jquery, "1.6.4", "Mobi Pick returns jQuery collection" );
	same( $dp.size(), 1, "Mobi Pick returns jQuery collection of size one" );
	same( $dp.get( 0 ).tagName.toUpperCase(), "INPUT", "Mobi Pick returns jQuery collection of one input." );
	$dp = $( "#mobipick" ).mobipick( "destroy" );
});

test( "Mobi Pick opens on tap", function() {
	var $dp        = $( "#mobipick" ).mobipick().trigger( "tap" ),
	    $set       = $( ".datepicker-set" ),
	    $cancel    = $( ".datepicker-cancel" ),
	    $prevDay   = $( ".datepicker-prev-day" ),
	    $day       = $( ".datepicker-day" ),
	    $nextDay   = $( ".datepicker-next-day" ),
	    $prevMonth = $( ".datepicker-prev-month" ),
	    $month     = $( ".datepicker-month" ),
	    $nextMonth = $( ".datepicker-next-month" ),
	    $prevYear  = $( ".datepicker-prev-year" ),
	    $year      = $( ".datepicker-year" ),
	    $nextYear =  $( ".datepicker-next-year" );
	
	same( typeof $prevDay.jquery, "string", "Is a jQuery collection." );
	same( $prevDay.size(), 1, "Appears only once." );
	same( typeof $day.jquery, "string", "Is a jQuery collection." );
	same( $day.size(), 1, "Appears only once." );
	same( typeof $nextDay.jquery, "string", "Is a jQuery collection." );
	same( $nextDay.size(), 1, "Appears only once." );

	same( typeof $prevMonth.jquery, "string", "Is a jQuery collection." );
	same( $prevMonth.size(), 1, "Appears only once." );
	same( typeof $month.jquery, "string", "Is a jQuery collection." );
	same( $month.size(), 1, "Appears only once." );
	same( typeof $nextMonth.jquery, "string", "Is a jQuery collection." );
	same( $nextMonth.size(), 1, "Appears only once." );

	same( typeof $prevYear.jquery, "string", "Is a jQuery collection." );
	same( $prevYear.size(), 1, "Appears only once." );
	same( typeof $year.jquery, "string", "Is a jQuery collection." );
	same( $year.size(), 1, "Appears only once." );
	same( typeof $nextYear.jquery, "string", "Is a jQuery collection." );
	same( $nextYear.size(), 1, "Appears only once." );
	    
	same( typeof $set.jquery, "string", "Is a jQuery collection." );
	same( $set.size(), 1, "Appears only once." );
	same( typeof $cancel.jquery, "string", "Is a jQuery collection." );
	same( $cancel.size(), 1, "Appears only once." );

	$dp = $( "#mobipick" ).mobipick( "destroy" );
});

test( "Mobi Pick uses current date if no default date is given, names are in english", function() {
	var $dp          = $( "#mobipick" ).mobipick().trigger( "tap" ),
	    $set       = $( ".datepicker-set" ),
	    $cancel    = $( ".datepicker-cancel" ),
	    $prevDay   = $( ".datepicker-prev-day" ),
	    $day       = $( ".datepicker-day" ),
	    $nextDay   = $( ".datepicker-next-day" ),
	    $prevMonth = $( ".datepicker-prev-month" ),
	    $month     = $( ".datepicker-month" ),
	    $nextMonth = $( ".datepicker-next-month" ),
	    $prevYear  = $( ".datepicker-prev-year" ),
	    $year      = $( ".datepicker-year" ),
	    $nextYear =  $( ".datepicker-next-year" );
	    date         = new Date();
	
	same( date.getFullYear().toString(), $year.val(), "If no default date is given, use current date." );
	same( XDate.locales['en'].monthNamesShort[ date.getMonth() ], $month.val(), "If no default date is given, use current date." );
	same( date.getDate().toString(), $day.val(), "If no default date is given, use current date." );

	$dp = $( "#mobipick" ).mobipick( "destroy" );
});

module( "Default date" );
test( "Check default date", function() {
	var $dp          = $( "#mobipick" ).attr( "value", "2008-10-17" ).mobipick(),
	    date         = new Date( 2008, 9, 17 ),
	    mobipickDate = $dp.mobipick( "option", "date" );

	same( mobipickDate.constructor, Date, "Option 'date' returns Date object." );
	same( date.getFullYear(), mobipickDate.getFullYear(), "If no default date is given, use current date." );
	same( date.getMonth(), mobipickDate.getMonth(), "If no default date is given, use current date." );
	same( date.getDate(), mobipickDate.getDate(), "If no default date is given, use current date." );
	$dp = $( "#mobipick" ).mobipick( "destroy" );
});

test( "Change date prev", function() {
	var $dp          = $( "#mobipick" ).attr( "value", "2008-10-17" ).mobipick().trigger( "tap" ),
	    $set       = $( ".datepicker-set" ),
	    $cancel    = $( ".datepicker-cancel" ),
	    $prevDay   = $( ".datepicker-prev-day" ),
	    $day       = $( ".datepicker-day" ),
	    $nextDay   = $( ".datepicker-next-day" ),
	    $prevMonth = $( ".datepicker-prev-month" ),
	    $month     = $( ".datepicker-month" ),
	    $nextMonth = $( ".datepicker-next-month" ),
	    $prevYear  = $( ".datepicker-prev-year" ),
	    $year      = $( ".datepicker-year" ),
	    $nextYear =  $( ".datepicker-next-year" );
	    date         = new Date( 2007, 8, 16 );
	
	$prevDay.trigger( "tap" );
	$prevMonth.trigger( "tap" );
	$prevYear.trigger( "tap" );
	$set.trigger( "tap" );

	var selectedDate = $dp.mobipick( "option", "date" );

	same( date.getFullYear(), selectedDate.getFullYear(), "Date has been modified." );
	same( date.getMonth(), selectedDate.getMonth(), "Date has been modified." );
	same( date.getDate(), selectedDate.getDate(), "Date has been modified." );

	$dp = $( "#mobipick" ).mobipick( "destroy" );
});

test( "Change date next", function() {
	var $dp          = $( "#mobipick" ).attr( "value", "2008-10-17" ).mobipick().trigger( "tap" ),
	    $set       = $( ".datepicker-set" ),
	    $cancel    = $( ".datepicker-cancel" ),
	    $prevDay   = $( ".datepicker-prev-day" ),
	    $day       = $( ".datepicker-day" ),
	    $nextDay   = $( ".datepicker-next-day" ),
	    $prevMonth = $( ".datepicker-prev-month" ),
	    $month     = $( ".datepicker-month" ),
	    $nextMonth = $( ".datepicker-next-month" ),
	    $prevYear  = $( ".datepicker-prev-year" ),
	    $year      = $( ".datepicker-year" ),
	    $nextYear =  $( ".datepicker-next-year" );
	    date         = new Date( 2009, 10, 18 );
	
	$nextDay.trigger( "tap" );
	$nextMonth.trigger( "tap" );
	$nextYear.trigger( "tap" );
	$set.trigger( "tap" );

	var selectedDate = $dp.mobipick( "option", "date" );

	same( date.getFullYear(), selectedDate.getFullYear(), "Date has been modified." );
	same( date.getMonth(), selectedDate.getMonth(), "Date has been modified." );
	same( date.getDate(), selectedDate.getDate(), "Date has been modified." );

	$dp = $( "#mobipick" ).mobipick( "destroy" );
});


