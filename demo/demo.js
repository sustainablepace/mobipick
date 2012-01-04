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

page.find( "input[type='date'].mobipick-accuracy-month" ).mobipick({
	accuracy: "month"
});

page.find( "input[type='date'].mobipick-accuracy-year" ).mobipick({
	accuracy: "year"
});

page.find( "input[type='date'].mobipick-accuracy-year-min-max-date" ).mobipick({
	accuracy: "year"
});


