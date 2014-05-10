'use strict';

(function() {
	// Papsables Controller Spec
	describe('Papsables Controller Tests', function() {
		// Initialize global variables
		var PapsablesController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Papsables controller.
			PapsablesController = $controller('PapsablesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Papsable object fetched from XHR', inject(function(Papsables) {
			// Create sample Papsable using the Papsables service
			var samplePapsable = new Papsables({
				name: 'New Papsable'
			});

			// Create a sample Papsables array that includes the new Papsable
			var samplePapsables = [samplePapsable];

			// Set GET response
			$httpBackend.expectGET('papsables').respond(samplePapsables);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.papsables).toEqualData(samplePapsables);
		}));

		it('$scope.findOne() should create an array with one Papsable object fetched from XHR using a papsableId URL parameter', inject(function(Papsables) {
			// Define a sample Papsable object
			var samplePapsable = new Papsables({
				name: 'New Papsable'
			});

			// Set the URL parameter
			$stateParams.papsableId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/papsables\/([0-9a-fA-F]{24})$/).respond(samplePapsable);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.papsable).toEqualData(samplePapsable);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Papsables) {
			// Create a sample Papsable object
			var samplePapsablePostData = new Papsables({
				name: 'New Papsable'
			});

			// Create a sample Papsable response
			var samplePapsableResponse = new Papsables({
				_id: '525cf20451979dea2c000001',
				name: 'New Papsable'
			});

			// Fixture mock form input values
			scope.name = 'New Papsable';

			// Set POST response
			$httpBackend.expectPOST('papsables', samplePapsablePostData).respond(samplePapsableResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Papsable was created
			expect($location.path()).toBe('/papsables/' + samplePapsableResponse._id);
		}));

		it('$scope.update() should update a valid Papsable', inject(function(Papsables) {
			// Define a sample Papsable put data
			var samplePapsablePutData = new Papsables({
				_id: '525cf20451979dea2c000001',
				name: 'New Papsable'
			});

			// Mock Papsable in scope
			scope.papsable = samplePapsablePutData;

			// Set PUT response
			$httpBackend.expectPUT(/papsables\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/papsables/' + samplePapsablePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid papsableId and remove the Papsable from the scope', inject(function(Papsables) {
			// Create new Papsable object
			var samplePapsable = new Papsables({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Papsables array and include the Papsable
			scope.papsables = [samplePapsable];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/papsables\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePapsable);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.papsables.length).toBe(0);
		}));
	});
}());