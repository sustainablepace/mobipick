var date       = new Date(),
    page       = $( ":jqmData(role='page')" );

page.find( "input[type='date'].mobipick-demo-basic" ).mobipick();

page.find( "input[type='date'].mobipick-demo-spanish" ).mobipick({
	locale: "es"
});

page.find( "input[type='date'].mobipick-demo-default-date" ).mobipick({
	locale: "en"
});

page.find( "input[type='date'].mobipick-demo-min-max-date" ).mobipick({
	locale: "en"
});


