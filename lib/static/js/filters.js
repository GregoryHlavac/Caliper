var templateFilters = [
	[ "std::basic_string<char,std::char_traits<char>,std::allocator<char> >", "std::string" ],
	[ "std::string,std::allocator<std::string > ", "std::string" ]
];

String.prototype.replaceAll = function (find, replace) {
	var str = this;
	return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

angular.module('caliperApp.filters', [])
	.filter('signature', function() {
		return function(input) {
			if(input)
			{
				var ind = input.indexOf('(');
				return ind != -1 ? input.substr(0, ind) : input;
			}
			return input;
		};
	})
	.filter('templated_types', function() {
		return function(input) {
			var filteredInput = input;

			templateFilters.forEach(function(filter) {
				filteredInput = filteredInput.replaceAll(filter[0], filter[1]);
			});

			return filteredInput;
		};
	});