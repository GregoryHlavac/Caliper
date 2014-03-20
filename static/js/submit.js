var reportSubmissionApp = angular.module('reportSubmissionApp', []);

reportSubmissionApp.controller('SubmitFormCtrl', function($scope)
{
	$scope.formFields = [
		{ 
			name: "user", 
			type: "text",
			required: true
		},
		{ 
			name: "description", 
			type: "textbox",
			required: true
		},
		{ 
			name: "crashdump", 
			type: "file",
			required: true
		}
	];
}).
directive('createForm', function($compile) {
        return 
        {
          template: '<div><label>{{input.label}}: </label></div>',
          replace: true,
          link: function(scope, element) {
            var el = angular.element('<span/>');
            switch(scope.input.inputType) 
            {
              case 'checkbox':
                el.append('<input type="checkbox" name="{{input.name}}" ng-model="input.checked" ng-required="{{input.required}}"/><span class="error"><span class="required">Required!</span></span>');
                break;
              case 'text':
                el.append('<input type="text" name="{{input.name}}" ng-model="input.value" ng-required="{{input.required}}" ng-minlength="{{input.min}}" ng-maxlength="{{input.max}}" /><span class="error"><span class="required">Required!</span><span class="minlength">Minimum length is {{input.min}}!</span><span class="maxlength">Maximum length is {{input.max}}!</span></span>');
                break;
              case 'file':
                el.append('<input type="file" name="{{input.name}}" ng-model="input.value" ng-required="{{input.required}}"/><span class="error"><span class="required">Required!</span></span>');
                break;
            }
            $compile(el)(scope);
            element.append(el);
          }
        }
      });