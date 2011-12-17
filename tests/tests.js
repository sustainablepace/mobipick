module( "Initialization, basic setting" );
test( "Check if Mobi Pick returns the jQuery collection", function() {
	var $dp = $( "#mobipick" ).mobipick();
	same( $dp.jquery, "1.6.4", "Mobi Pick returns jQuery collection" );
	same( $dp.size(), 1, "Mobi Pick returns jQuery collection of size one" );
	same( $dp.get( 0 ).tagName.toUpperCase(), "INPUT", "Mobi Pick returns jQuery collection of one input." );
	$dp = $( "#mobipick" ).mobipick( "destroy" );
});

module( "Initialization, default date" );
test( "Check default date", function() {
	var $dp          = $( "#mobipick" ).attr( "value", "2008-10-17" ).mobipick(),
	    date         = new Date( 2008, 9, 17 ),
	    mobipickDate = $dp.mobipick( "option", "date" );

	same( mobipickDate.constructor, Date, "Option 'date' returns Date object." );
	same( date.getFullYear(), mobipickDate.getFullYear(), "If no default date is given, use current date." );
	same( date.getMonth(), mobipickDate.getMonth(), "If no default date is given, use current date." );
	same( date.getDate(), mobipickDate.getDate(), "If no default date is given, use current date." );
});


