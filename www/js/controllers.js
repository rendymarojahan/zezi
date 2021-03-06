angular.module('app.controllers', [])

.controller('AppCtrl', function ($scope, $state, $timeout, $cacheFactory, $rootScope, AccountsFactory, PublicsFactory, CurrentUserService, $ionicActionSheet, $ionicHistory, $cordovaAppVersion, myCache) {

    $scope.showMenuIcon = true;
    $scope.appversion = '1';
    
    $scope.firstname = CurrentUserService.firstname;
    $scope.surename = CurrentUserService.surename;
    $scope.fullname = function (){
    	return $scope.firstname +" "+ $scope.surename;
    };
    $scope.photo = CurrentUserService.photo;
    $scope.login = Date.now();

    $scope.friends = [];
    $scope.friends = PublicsFactory.getFriends();

    // SWIPE FRIENDS
    $scope.listCanSwipe = true;
    $scope.swipeOptions = function ($event, friend) {
        $state.go('tabsController.friend', { friendId: friend.friends_id, friendName: friend.name });
    };



    // SWIPE CHATS
    $scope.listCanSwipe = true;
    $scope.handleSwipeOptions = function ($event, friend) {
        $state.go('tabsController.chat', { isNew: 'True', friendId: friend.friends_id, friendName: friend.name });
    };

    // Triggered on a the logOut button click
    $scope.showLogOutMenu = function () {

        // Show the action sheet
        $ionicActionSheet.show({
            destructiveText: 'Logout',
            titleText: 'Are you sure you want to logout?',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function () {
            	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			        if (fromState.name === "tabsController") {
			            refresh($rootScope, $scope, PublicsFactory, CurrentUserService, $stateParams.memberPublicId, $stateParams.memberId);
			        }
			    });
			    function refresh($rootScope, $scope, PublicsFactory, CurrentUserService) {
			    	this.firstname = '';
		            this.surename = '';
		            this.email = '';
		            this.group_id = '';
		            this.public_id = '';
		            this.defaultdate = '';
		            this.defaultbalance = '';
		            this.lastdate = '';
		            this.group_name = '';
			    }
			    $ionicHistory.clearCache('thisGroupId', 'thisUserName', 'thisMemberId', 'thisPublicId');
            	$ionicHistory.clearHistory();
        		$ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                $rootScope.authData = '';
                fb.unauth();
                myCache.remove('thisGroupId', 'thisUserName', 'thisMemberId', 'thisPublicId'); 
                myCache.removeAll();
                $state.go('login');
        		
        		
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                
            }
        });
    };
})
  
.controller('peopleCtrl', function($scope, $state, $stateParams, MembersFactory, PublicsFactory, $ionicFilterBar, $ionicListDelegate, PickTransactionServices, CurrentUserService, myCache) {

    $scope.publics = [];
    $scope.friends = [];
    $scope.userId = myCache.get('thisMemberId')
    $scope.photo = CurrentUserService.photo;

    $scope.$on('$ionicView.beforeLeave', function () {
        $scope.hideValidationMessage = true;
        $stateParams.memberPublicId = '';
        $stateParams.memberId = '';
    });

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (fromState.name === "tabsController.people") {
            refresh($scope.publics, $scope, MembersFactory, PublicsFactory);
        }
    });

    $scope.publics = PublicsFactory.getMemberPublics($scope.userId);
    $scope.publics.$loaded().then(function (x) {
    	refresh($scope.publics, $scope, MembersFactory, PublicsFactory);
    }).catch(function (error) {
        console.error("Error:", error);
    });

    $scope.friends = PublicsFactory.getFriends();
    $scope.friends.$loaded().then(function (x) {
    	var index;
    //
	    for (index = 0; index < $scope.friends.length; ++index) {
	        //
	        var friend = $scope.friends[index];

	        if (friend.friends_id !== '') {
	        	$scope.temans = PublicsFactory.getMemberPublics(friend.friends_id);
			    $scope.temans.$loaded().then(function (x) {
			    	$scope.publics = $scope.temans.concat($scope.publics);
			    }).catch(function (error) {
			        console.error("Error:", error);
			    });
	        }
	    }
        refresh($scope.publics, $scope, MembersFactory, PublicsFactory);;
    }).catch(function (error) {
        console.error("Error:", error);
    });

    $scope.doRefresh = function (){

    	$scope.friends = PublicsFactory.getFriends();
	    $scope.friends.$loaded().then(function (x) {
	    	var index;
	    //
		    for (index = 0; index < $scope.friends.length; ++index) {
		        //
		        var friend = $scope.friends[index];

		        if (friend.member_id !== '') {
		        	$scope.temans = PublicsFactory.getMemberPublics(friend.member_id);
				    $scope.temans.$loaded().then(function (x) {
				    	$scope.publics = $scope.temans.concat($scope.publics);
				    }).catch(function (error) {
				        console.error("Error:", error);
				    });
		        }
		    }
	        refresh($scope.publics, $scope, MembersFactory, PublicsFactory);
	        $scope.$broadcast('scroll.refreshComplete');
	    }).catch(function (error) {
	        console.error("Error:", error);
	    });

    };

    var filterBarInstance;
    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.publics,
            update: function (filteredItems, filterText) {
                $scope.people = filteredItems;
            },
            filterProperties: 'name'
        });
    };

    $scope.listCanSwipe = true;
    $scope.handleSwipeOptions = function ($event, public) {
        $state.go('tabsController.post', { postId: public.$id });
    };

    $scope.createPosting = function () {
        PickTransactionServices.typeDisplaySelected = '';
        PickTransactionServices.typeInternalSelected = '';
        PickTransactionServices.categorySelected = '';
        PickTransactionServices.categoryid = '';
        PickTransactionServices.amountSelected = '';
        PickTransactionServices.dateSelected = '';
        PickTransactionServices.payeeSelected = '';
        PickTransactionServices.payeeid = '';
        PickTransactionServices.accountFromSelected = '';
        PickTransactionServices.accountFromId = '';
        PickTransactionServices.accountToSelected = '';
        PickTransactionServices.accountToId = '';
        PickTransactionServices.photoSelected = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        PickTransactionServices.noteSelected = '';
        $state.go('tabsController.posting');
    }

    function refresh(publics, $scope, MembersFactory, PublicsFactory) {
    
    }

})

.controller('postingCtrl', function ($scope, $state, $stateParams, $cordovaSocialSharing, $cordovaCamera, $ionicActionSheet, $ionicHistory, AccountsFactory, PickTransactionServices, PayeesService, myCache, CurrentUserService) {

    $scope.hideValidationMessage = true;
    $scope.loadedClass = 'hidden';
    $scope.transactions = [];
    $scope.AccountTitle = '';
    $scope.inEditMode = false;
    $scope.isTransfer = false;
    $scope.ItemFrom = {};
    $scope.ItemTo = {};
    $scope.ItemOriginal = {};
    $scope.DisplayDate = '';
    $scope.currentItem = {
        'accountFrom': '',
        'accountFromId': '',
        'accountTo': '',
        'accountToId': '',
        'account': '',
        'accountId': '',
        'amount': '',
        'category': '',
        'categoryid': '',
        'date': '',
        'iscleared': false,
        'isrecurring': false,
        'istransfer': false,
        'isphoto': false,
        'note': '',
        'payee': '',
        'photo': '',
        'runningbal': '',
        'type': '',
        'typedisplay': ''
    };

    $scope.firstname = CurrentUserService.firstname;
    $scope.surename = CurrentUserService.surename;
    $scope.fullname = function (){
    	return $scope.firstname +" "+ $scope.surename;
    };
    $scope.photo = CurrentUserService.photo;

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.hideValidationMessage = true;
        $scope.publicId = myCache.get('thisPublicId');
        $scope.currentItem.typedisplay = PickTransactionServices.typeDisplaySelected;
        $scope.currentItem.type = PickTransactionServices.typeInternalSelected;
        $scope.currentItem.payee = PickTransactionServices.payeeSelected;
        $scope.currentItem.payeeid = PickTransactionServices.payeeid;
        $scope.currentItem.category = PickTransactionServices.categorySelected;
        $scope.currentItem.categoryid = PickTransactionServices.categoryid;
        $scope.currentItem.amount = PickTransactionServices.amountSelected;
        $scope.currentItem.account = PickTransactionServices.accountSelected;
        $scope.currentItem.accountId = PickTransactionServices.accountId;
        $scope.currentItem.accountFrom = PickTransactionServices.accountFromSelected;
        $scope.currentItem.accountFromId = PickTransactionServices.accountFromId;
        $scope.currentItem.accountTo = PickTransactionServices.accountToSelected;
        $scope.currentItem.accountToId = PickTransactionServices.accountToId;
        $scope.currentItem.photo = PickTransactionServices.photoSelected;
        if ($scope.currentItem.photo === 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==') {
            $scope.currentItem.photo = '';
            $scope.currentItem.isphoto = false;
        }
        $scope.currentItem.note = PickTransactionServices.noteSelected;
        $scope.isTransfer = ($scope.currentItem.typedisplay === "Transfer") ? true : false;
        // Handle transaction date
        if (typeof PickTransactionServices.dateSelected !== 'undefined' && PickTransactionServices.dateSelected !== '') {
            $scope.DisplayDate = PickTransactionServices.dateSelected;
        }
        // Handle transaction type
        if ($scope.currentItem.typedisplay === "Transfer" && $scope.currentItem.accountFromId === $scope.currentItem.accountToId) {
            PickTransactionServices.typeInternalSelected = 'Income';
        } else if ($scope.currentItem.typedisplay === "Transfer" && $scope.currentItem.accountFromId !== $scope.currentItem.accountToId) {
            PickTransactionServices.typeInternalSelected = 'Expense';
        }
        // Handle Two Ways Binding
        if ($scope.currentItem.typedisplay === "Transfer"){
        	$scope.type = function (){ return "transfer ";};
    	} else if ($scope.currentItem.typedisplay === "Income"){
        	$scope.type = function (){ return "get ";};
        } else if ($scope.currentItem.typedisplay === "Expense"){
        	$scope.type = function (){ return "spend ";};
        }
        if ($scope.currentItem.category !== ''){
        	$scope.category = function (){ return " for " + $scope.currentItem.category;};
    	}
        if ($scope.currentItem.payee !== ''){
        	$scope.location = function (){ return " at " + $scope.currentItem.payee;};
    	}
    	if (typeof PickTransactionServices.accountSelected !== 'undefined'){
        	$scope.account = function (){ return " using " + $scope.currentItem.account;};
    	}
    	if ($scope.currentItem.amount !== ''){
        	$scope.amount = function (){ return " " + $scope.currentItem.amount;};
    	}
    	if ($scope.currentItem.note !== ''){
        	$scope.note = function (){ return " " + $scope.currentItem.note;};
    	}
    	if ($scope.currentItem.photo !== ''){
        	$scope.sphoto = function (){ return " " + $scope.currentItem.photo;};
    	}
    });

    // PICK TRANSACTION TYPE
    $scope.pickPostPhoto = function() {
	
		$scope.hideSheet = $ionicActionSheet.show({

			buttons: [
        		{ text: '<i class="icon ion-camera"></i> Take Picture' },
        		{ text: '<i class="icon ion-images"></i> Choose Album' },
    		],
			buttonClicked: function(index) {
				switch (index) {
                case 0:
                    $scope.currentItem = { photo: PickTransactionServices.photoSelected };
        				
            				var options = {
			                quality: 75,
			                destinationType: Camera.DestinationType.DATA_URL,
			                sourceType: Camera.PictureSourceType.CAMERA,
			                allowEdit: false,
			                encodingType: Camera.EncodingType.JPEG,
			                popoverOptions: CameraPopoverOptions,
			                targetWidth: 800,
			                targetHeight: 800,
			                saveToPhotoAlbum: false
            				};
				            $cordovaCamera.getPicture(options).then(function (imageData) {
				                $scope.currentItem.photo = imageData;
								PickTransactionServices.updatePhoto($scope.currentItem.photo);
								$scope.currentItem.isphoto = true;
				            }, function (error) {
				                console.error(error);
				            })

                break;
                case 1:
                	$scope.currentItem = { photo: PickTransactionServices.photoSelected };
            				var options = {
			                quality: 75,
			                destinationType: Camera.DestinationType.DATA_URL,
			                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			                allowEdit: false,
			                encodingType: Camera.EncodingType.JPEG,
			                popoverOptions: CameraPopoverOptions,
			                targetWidth: 800,
			                targetHeight: 800,
			                saveToPhotoAlbum: false
            				};
				            $cordovaCamera.getPicture(options).then(function (imageData) {
				                $scope.currentItem.photo = imageData;
				                PickTransactionServices.updatePhoto($scope.currentItem.photo);
				                $scope.currentItem.isphoto = true;
				            }, function (error) {
				                console.error(error);
				            })
        			
                break;
            	}
            	return true;
    		},
			cancelText: 'Cancel',
				cancel: function() {
				console.log('CANCELLED');
			}
		});	
	}

    

    // PICK TRANSACTION TYPE
    // Don't let users change the transaction type. If needed, a user can delete the transaction and add a new one
    $scope.pickPostTransactionType = function () {
        if ($scope.currentItem.istransfer) {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Transaction type on transfers cannot be changed."
            return;
        } else {
            $state.go('tabsController.pickposttransactiontype');
        }
    }

    // GET PAYEE
    // Make sure the transaction type (Expense, Income, Transfer) has been selected first
    $scope.getPayee = function () {
        if (typeof $scope.currentItem.typedisplay === 'undefined' || $scope.currentItem.typedisplay === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select Transaction Type"
            return;
        } else {
            $state.go('tabsController.pickposttransactionpayee');
        }
    }

    $scope.shareViaTwitter = function(message, image, link) {
    	if (typeof $scope.currentItem.note === 'undefined' || $scope.currentItem.note === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please type some note"
            return;
        }
        if (typeof $scope.currentItem.photo === 'undefined' || $scope.currentItem.photo === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please take a photo"
            return;
        }else {
	        $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
	            $cordovaSocialSharing.shareViaTwitter(message, image, link);
	        }, function(error) {
	            alert("Cannot share on Twitter");
	        });
	    }
    }

    $scope.shareViaFacebook = function(message, image, link) {
    	if (typeof $scope.currentItem.note === 'undefined' || $scope.currentItem.note === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please type some note"
            return;
        }
        if (typeof $scope.currentItem.photo === 'undefined' || $scope.currentItem.photo === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please take a photo"
            return;
        }else {
	        $cordovaSocialSharing.shareViaFacebook(message, image, link).then(function(result) {
	            alert("Share on Facebook Success");
	        }, function(error) {
	            alert("Cannot share on Facebook");
	        });
	    }
    }

    // SAVE
    $scope.saveTransaction = function () {

        // Validate form data
        if (typeof $scope.currentItem.typedisplay === 'undefined' || $scope.currentItem.typedisplay === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select Transaction Type"
            return;
        }
        if (typeof $scope.currentItem.category === 'undefined' || $scope.currentItem.category === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a Category"
            return;
        }
        if (typeof $scope.currentItem.payee === 'undefined' || $scope.currentItem.payee === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a Payee"
            return;
        }
        if (typeof $scope.currentItem.amount === 'undefined' || $scope.currentItem.amount === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter an amount for this transaction"
            return;
        }
        if (typeof $scope.currentItem.accountFrom === $scope.currentItem.accountTo) {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Transfer Account Cannot Same"
            return;
        }

        // Format date
        $scope.currentItem.date = Date.now();
        if (typeof $scope.currentItem.date === 'undefined' || $scope.currentItem.date === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a date for this transaction"
            return;
        }

        //
        // Handle transaction type for Transfers
        //
        if ($scope.currentItem.typedisplay === "Transfer") {
            $scope.currentItem.type = 'Expense';
            $scope.currentItem.istransfer = true;
        } else {
            $scope.currentItem.accountFrom = '';
            $scope.currentItem.accountFromId = '';
            $scope.currentItem.accountTo = '';
            $scope.currentItem.accountToId = '';
            $scope.currentItem.type = $scope.currentItem.typedisplay;
            $scope.currentItem.istransfer = false;
        }

       

        if ($scope.inEditMode) {
            //
            // Update Existing Transaction
            //
            var onComplete = function (error) {
                if (error) {
                    //console.log('Synchronization failed');
                }
            };
            AccountsFactory.saveTransaction($scope.currentItem);


            ////
            //// Update transaction under category
            ////
            //var categoryTransactionRef = AccountsFactory.getTransactionByCategoryRef($scope.currentItem.categoryid, $stateParams.transactionId);
            //var categoryTransaction = {
            //    payee: $scope.currentItem.payee,
            //    amount: $scope.currentItem.amount,
            //    date: $scope.currentItem.date,
            //    type: $scope.currentItem.type,
            //    iscleared: $scope.currentItem.iscleared
            //};
            //categoryTransactionRef.update(categoryTransaction, onComplete);
            ////
            //// Update transaction under payee
            ////
            //var payeeTransactionRef = AccountsFactory.getTransactionByPayeeRef($scope.currentItem.payeeid, $stateParams.transactionId);
            //var payeeTransaction = {
            //    payee: $scope.currentItem.payee,
            //    amount: $scope.currentItem.amount,
            //    date: $scope.currentItem.date,
            //    type: $scope.currentItem.type,
            //    iscleared: $scope.currentItem.iscleared
            //};
            //payeeTransactionRef.update(payeeTransaction, onComplete);


            //
            // Update payee-category relationship
            //
            var payee = {};
            var payeeRef = PayeesService.getPayeeRef($scope.currentItem.payeeid);
            if ($scope.currentItem.type === "Income") {
                payee = {
                    lastamountincome: $scope.currentItem.amount,
                    lastcategoryincome: $scope.currentItem.category,
                    lastcategoryidincome: $scope.currentItem.categoryid
                };
            } else if ($scope.currentItem.type === "Expense") {
                payee = {
                    lastamount: $scope.currentItem.amount,
                    lastcategory: $scope.currentItem.category,
                    lastcategoryid: $scope.currentItem.categoryid
                };
            }
            payeeRef.update(payee);

            //
            // Update transfer relationship
            //
            var accountId = '';
            var otherAccountId = '';
            var OtherTransaction = {};
            if ($scope.ItemOriginal.istransfer) {
                if ($stateParams.accountId === $scope.currentItem.accountToId) {
                    // Transfer is coming into the current account --> income
                    $scope.currentItem.type = 'Income';
                    accountId = $scope.currentItem.accountToId;
                    otherAccountId = $scope.currentItem.accountFromId;
                    OtherTransaction.type = 'Expense';
                    OtherTransaction.amount = $scope.currentItem.amount;
                } else {
                    // Transfer is moving into the other account --> expense
                    $scope.currentItem.type = 'Expense';
                    accountId = $scope.currentItem.accountFromId;
                    otherAccountId = $scope.currentItem.accountToId;
                    OtherTransaction.type = 'Income';
                    OtherTransaction.amount = $scope.currentItem.amount;
                }

                console.log(OtherTransaction);

                var transferRef = AccountsFactory.getTransactionRef(otherAccountId, $scope.ItemOriginal.linkedtransactionid);
                transferRef.update(OtherTransaction);
            }

            $scope.inEditMode = false;
            //
        } else {
            //
            // Create New Transaction
            //
            if (isNaN($scope.currentItem.notes)) {
                $scope.currentItem.notes = "";
            }
            $scope.currentItem.addedby = myCache.get('thisUserName');
            $scope.currentItem.userid = myCache.get('thisMemberId');
            //
            AccountsFactory.createTransaction($scope.currentItem.accountId, $scope.currentItem);
        }
        $scope.currentItem = {};
        $ionicHistory.goBack();
    }
})

.controller('pickPostTransactionAmountCtrl', function ($scope, $ionicHistory, PickTransactionServices) {

    $scope.clearValue = true;
    $scope.displayValue = 0;
    if (typeof PickTransactionServices.amountSelected !== 'undenifed') {
        $scope.displayValue = PickTransactionServices.amountSelected;
    }
    $scope.digitClicked = function (digit) {
        if (digit === 'C') {
            $scope.displayValue = '';
            $scope.clearValue = true;
        } else if (digit === '.') {
            $scope.displayValue = $scope.displayValue + digit;
        } else if (digit === 'B') {
            $scope.displayValue = $scope.displayValue.substring(0, $scope.displayValue.length - 1);
            $scope.clearValue = false;
        } else if (digit === 'D') {
            PickTransactionServices.updateAmount($scope.displayValue);
            $ionicHistory.goBack();
        } else {
            if ($scope.clearValue) {
                $scope.displayValue = digit;
                $scope.clearValue = false;
            } else {
                $scope.displayValue = $scope.displayValue + digit;
            }
        }
    };
})

.controller('pickPostTransactionAccountCtrl', function ($scope, $state, $ionicHistory, AccountsFactory, PickTransactionServices, SelectAccountServices) {
    //
    // Get accounts
    //
    $scope.TransactionAccountList = AccountsFactory.getAccounts();
    $scope.TransactionAccountList.$loaded().then(function () {});
    $scope.currentItem = { accountFrom: PickTransactionServices.accountSelected };
    $scope.itemchanged = function (account) {
        PickTransactionServices.updateAccount(account.accountname, account.$id);
        PickTransactionServices.categorySelected = '';
        PickTransactionServices.categoryid = '';
        $ionicHistory.goBack();
    };

    $scope.createAccount = function () {
        SelectAccountServices.nameSelected = '';
        SelectAccountServices.amountSelected = '';
        SelectAccountServices.typeSelected = '';
        SelectAccountServices.dateSelected = '';
        $state.go('tabsController.postaccount', { accountId: '-1', isNew: 'True' });
    }
})

.controller('postAccountCtrl', function ($scope, $state, $stateParams, AccountsFactory, SelectAccountServices) {

    $scope.hideValidationMessage = true;
    $scope.AccountTitle = '';
    $scope.inEditMode = false;
    $scope.DisplayDate = '';
    $scope.currentItem = {
        'accountname': '',
        'accounttype': '',
        'autoclear': 'false',
        'balancecleared': '0',
        'balancetoday': '0',
        'dateopen': ''
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.hideValidationMessage = true;
        $scope.currentItem.accounttype = SelectAccountServices.typeSelected;
        // Handle transaction date
        if (typeof SelectAccountServices.dateSelected !== 'undefined' && SelectAccountServices.dateSelected !== '') {
            $scope.DisplayDate = SelectAccountServices.dateSelected;
        }
    });

    // EDIT / CREATE ACCOUNT
    if ($stateParams.isNew === 'True') {
        $scope.AccountTitle = "Create Account";
    } else {
        // Edit account
        $scope.inEditMode = true;
        var account = AccountsFactory.getAccount($stateParams.accountId);
        $scope.currentItem = account;
        $scope.DisplayDate = moment(account.dateopen).format('MMMM D, YYYY');
        SelectAccountServices.dateSelected = $scope.DisplayDate;
        SelectAccountServices.typeSelected = $scope.currentItem.accounttype;
        $scope.AccountTitle = "Edit Account";
    }

    // SAVE
    $scope.saveAccount = function () {

        // Validate form data
        if (typeof $scope.currentItem.accountname === 'undefined' || $scope.currentItem.accountname === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter a name for this account"
            return;
        }
        if (typeof $scope.currentItem.accounttype === 'undefined' || $scope.currentItem.accounttype === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select an account type"
            return;
        }

        // Format date
        $scope.currentItem.dateopen = Date.now();

        if (typeof $scope.currentItem.dateopen === 'undefined' || $scope.currentItem.dateopen === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a date for this account"
            return;
        }

        if ($scope.inEditMode) {
            //
            // Update Existing Account
            //
            AccountsFactory.saveAccount($scope.currentItem);
            $scope.inEditMode = false;
        } else {
            //
            // Create New Transaction
            //
            AccountsFactory.createNewAccount($scope.currentItem);
        }
        $scope.currentItem = {};
        $state.go('tabsController.pickposttransactionaccount');
    }
})

.controller('pickPostTransactionAccountFromCtrl', function ($scope, $ionicHistory, AccountsFactory, PickTransactionServices) {
    //
    // Get accounts
    //
    $scope.TransactionAccountList = AccountsFactory.getAccounts();
    $scope.TransactionAccountList.$loaded().then(function () {});
    $scope.currentItem = { accountFrom: PickTransactionServices.accountFromSelected };
    $scope.itemchanged = function (account) {
        PickTransactionServices.updateAccountFrom(account.accountname, account.$id);
        PickTransactionServices.categorySelected = '';
        PickTransactionServices.categoryid = '';
        $ionicHistory.goBack();
    };
})

// PICK TRANSACTION ACCOUNT-TO CONTROLLER
.controller('pickPostTransactionAccountToCtrl', function ($scope, $ionicHistory, AccountsFactory, PickTransactionServices) {
    //
    // Get accounts
    //
    $scope.TransactionAccountList = AccountsFactory.getAccounts();
    $scope.TransactionAccountList.$loaded().then(function () {});
    $scope.currentItem = { accountTo: PickTransactionServices.accountToSelected };
    $scope.itemchanged = function (account) {
        PickTransactionServices.updateAccountTo(account.accountname, account.$id);
        PickTransactionServices.categorySelected = '';
        PickTransactionServices.categoryid = '';
        $ionicHistory.goBack();
    };
    
})

.controller('pickPostTransactionCategoryCtrl', function ($scope, $state, $ionicHistory, CategoriesFactory, PickTransactionServices, PickCategoryTypeService, PickParentCategoryService) {
    //
    // To fetch categories, we need to know the transaction type first (Expense/Income)
    //
    if (PickTransactionServices.typeInternalSelected === '') {
        $scope.TransactionCategoryList = '';
    } else {
        $scope.categoriesDividerTitle = PickTransactionServices.typeInternalSelected;
        $scope.TransactionCategoryList = CategoriesFactory.getCategoriesByTypeAndGroup(PickTransactionServices.typeInternalSelected);
        $scope.TransactionCategoryList.$loaded().then(function () {
        });
    };
    $scope.currentItem = { categoryname: PickTransactionServices.categorySelected };
    $scope.categorychanged = function (item) {
        PickTransactionServices.updateCategory(item.categoryname, item.$id);
        $ionicHistory.goBack();
    };
    // CREATE CATEGORY
    $scope.createCategory = function () {
        PickCategoryTypeService.typeSelected = '';
        PickParentCategoryService.parentcategorySelected = '';
        $state.go('tabsController.postcategory');
    }
})

.controller('pickPostTransactionPayeeCtrl', function ($scope, $ionicHistory, PayeesFactory, PayeesService, PickTransactionServices) {

    $scope.inEditMode = false;
    $scope.hideValidationMessage = true;
    $scope.PayeeTitle = '';
    $scope.currentItem = {};
    $scope.data = { "payees": [], "search": '' };
    $scope.search = function () {
        PayeesFactory.searchPayees($scope.data.search).then(
    		function (matches) {
    		    $scope.data.payees = matches;
    		}
    	)
    }
    
    // EDIT / CREATE PAYEE
    if (typeof PickTransactionServices.payeeSelected !== 'undefined' && PickTransactionServices.payeeSelected !== '') {
        // Edit Payee
        $scope.inEditMode = true;
        $scope.PayeeTitle = "Check In";
        PayeesService.getPayee(PickTransactionServices.payeeid).then(function (payee) {
            $scope.currentItem = payee;
        });
        $scope.data.search = PickTransactionServices.payeeSelected;
    } else {
        $scope.PayeeTitle = "Check In";
        $scope.inEditMode = false;
    }

    // SAVE PAYEE
    $scope.savePayee = function () {

        // Validate form data
        if (typeof $scope.data.search === 'undefined' || $scope.data.search === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter payee name"
            return;
        }
        $scope.currentItem.payeename = $scope.data.search;
        $scope.currentItem.payeesort = $scope.data.search.toUpperCase();
        if ($scope.inEditMode) {
            // Update
            var onComplete = function (error) {
                if (error) {
                    //console.log('Synchronization failed');
                }
            };
            //
            // Update this payee
            //
            var payeeRef = PayeesService.getPayeeRef(PickTransactionServices.payeeid);
            payeeRef.update($scope.currentItem, onComplete);


            ////
            //// Update all transactions under this payee
            ////
            //$scope.transactionsbypayee = PayeesService.getTransactionsByPayee(PickTransactionServices.payeeid);
            //$scope.transactionsbypayee.$loaded().then(function () {
            //    angular.forEach($scope.transactionsbypayee, function (transaction) {
            //        transaction.payee = $scope.currentItem.payeename;
            //        $scope.transactionsbypayee.$save(transaction).then(function (ref) {
                        
            //        });
            //    })
            //})


            //
            // TODO: Update all transactions with new payee name
            // Find a way to update all necessary transactions with new payee name 
            //
            // Rehydrate payee and go back
            //
            $scope.inEditMode = false;
            PickTransactionServices.updatePayee($scope.currentItem, PickTransactionServices.payeeid);
            $ionicHistory.goBack();
            //
        } else {
            //
            // Create New Payee
            //
            var payeesRef = PayeesService.getPayeesRef();
            var newpayeeRef = payeesRef.push($scope.currentItem, function (error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else {
                    var payeeid = '';
                    payeeid = newpayeeRef.key();
                    PickTransactionServices.updatePayee($scope.currentItem, payeeid, PickTransactionServices.typeInternalSelected);
                    $ionicHistory.goBack();
                }
            });
        }
    }
    $scope.selectPayee = function (payee) {
        PickTransactionServices.updatePayee(payee, payee.$id, PickTransactionServices.typeInternalSelected);
        $ionicHistory.goBack();
    }
})

.controller('pickPostTransactionTypeCtrl', function ($scope, $ionicHistory, PickTransactionServices) {
    $scope.TransactionTypeList = [
        { text: 'Income', value: 'Income' },
        { text: 'Expense', value: 'Expense' },
        { text: 'Transfer', value: 'Transfer' }];
    $scope.currentItem = { typedisplay: PickTransactionServices.typeDisplaySelected };
    $scope.itemchanged = function (item) {
        PickTransactionServices.updateType(item.value, item.value);
        $ionicHistory.goBack();
    };
})

.controller('pickPostTransactionNoteCtrl', function ($scope, $ionicHistory, PickTransactionServices) {

    if (typeof PickTransactionServices.noteSelected !== 'undefined' && PickTransactionServices.noteSelected !== '') {
        $scope.note = PickTransactionServices.noteSelected;
    }
    $scope.saveNote = function () {
        PickTransactionServices.updateNote($scope.note);
        $ionicHistory.goBack();
    };

})

.controller('pickPostParentCategoryCtrl', function ($scope, $state, $ionicHistory, CategoriesFactory, PickParentCategoryService, PickCategoryTypeService) {
    if (PickCategoryTypeService.typeSelected === '') {
        $scope.ParentCategoryList = '';
    } else {
        $scope.ParentCategoryList = CategoriesFactory.getParentCategories(PickCategoryTypeService.typeSelected);
        $scope.ParentCategoryList.$loaded().then(function () {
            $scope.items = [];
            angular.forEach($scope.ParentCategoryList, function (category) {
                if (category.categoryparent === "") {
                    $scope.items.push(category);
                }
            })
        })
    };
    $scope.currentItem = { categoryname: PickParentCategoryService.parentcategorySelected };
    $scope.categorychanged = function (item) {
        PickParentCategoryService.updateParentCategory(item.categoryname);
        $ionicHistory.goBack();
    };
})

// PICK CATEGORYTYPE CONTROLLER
.controller('pickPostCategoryTypeCtrl', function ($scope, $state, $ionicHistory, PickCategoryTypeService) {
    $scope.CategoryTypeList = [
          { text: 'Income', value: 'Income' },
          { text: 'Expense', value: 'Expense' }];
    $scope.currentItem = { categorytype: PickCategoryTypeService.typeSelected };
    $scope.itemchanged = function (item) {
        PickCategoryTypeService.updateType(item.value);
        $ionicHistory.goBack();
    };
})

// CATEGORY CONTROLLER
.controller('postCategoryCtrl', function ($scope, $state, $ionicHistory, $stateParams, CategoriesFactory, PickParentCategoryService, PickCategoryTypeService) {

    $scope.hideValidationMessage = true;
    $scope.inEditMode = false;
    $scope.allowParent = false;
    $scope.currentItem = {
        'categoryname': '',
        'categorytype': '',
        'categoryparent': '',
        'categorysort': ''
    };
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.hideValidationMessage = true;
        $scope.currentItem.categoryparent = PickParentCategoryService.parentcategorySelected;
        $scope.currentItem.categorytype = PickCategoryTypeService.typeSelected;
    });

    // EDIT / CREATE CATEGORY
    if ($stateParams.categoryid === '') {
        // create
        $scope.CategoryTitle = "Create Category";
    } else {
        // edit
        $scope.inEditMode = true;
        CategoriesFactory.getCategory($stateParams.categoryid, $stateParams.type).then(function (category) {
            $scope.currentItem = category;
            PickCategoryTypeService.typeSelected = $scope.currentItem.categorytype;
            PickParentCategoryService.parentcategorySelected = $scope.currentItem.categoryparent;
        });
        $scope.CategoryTitle = "Edit Category";
    }

    // SAVE
    $scope.saveCategory = function () {

        // Validate form data
        if (typeof $scope.currentItem.categoryname === 'undefined' || $scope.currentItem.categoryname === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please type a category name"
            return;
        }
        if (typeof $scope.currentItem.categorytype === 'undefined' || $scope.currentItem.categorytype === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a category type"
            return;
        }

        if ($scope.currentItem.categoryparent === '') {
            $scope.currentItem.categorysort = $scope.currentItem.categoryname.toUpperCase();
        } else {
            $scope.currentItem.categorysort = $scope.currentItem.categoryparent.toUpperCase() + ":" + $scope.currentItem.categoryname.toUpperCase();
        }
        if ($scope.inEditMode) {
            // Update
            var onComplete = function (error) {
                if (error) {
                    //console.log('Synchronization failed');
                }
            };
            var categoryRef = CategoriesFactory.getCategoryRef($stateParams.categoryid, $stateParams.type);
            categoryRef.update($scope.currentItem, onComplete);
            $scope.inEditMode = false;
        } else {
            // Create
            var sync = CategoriesFactory.getCategories($scope.currentItem.categorytype);
            sync.$add($scope.currentItem).then(function (newChildRef) {
                $scope.currentItem = {
                    accountid: newChildRef.key()
                };
            });
        }
        $scope.currentItem = {};
        $ionicHistory.goBack();
    }
})
   
.controller('notificationCtrl', function($scope) {

})
   
.controller('chitChatCtrl', function($scope, $state, ChatsFactory, myCache, $stateParams) {
	$scope.chats = [];
	$scope.chatId = myCache.get('thisMemberId');
	ChatsFactory.getChatList($scope.chatId).then(
            function (matches) {
                $scope.chats = matches;
                refresh($scope.chats, $scope, ChatsFactory, $stateParams.chatId, $stateParams.friendId, $stateParams.friendName);
            }
    );

	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (fromState.name === "tabsController.chitChat") {
            refresh($scope.chats, $scope, ChatsFactory, $stateParams.chatId, $stateParams.friendId, $stateParams.friendName, myCache);
        }
    });

    $scope.listCanSwipe = true;
    $scope.handleSwipeOptions = function ($event, chat) {
        $state.go('tabsController.chat', { chatId: chat.$id, friendId: chat.switchSendTo, friendName: chat.switchRecipier });
    };

    

    $scope.doRefresh = function() {
		ChatsFactory.getChatList($scope.chatId).then(
            function (matches) {
                $scope.chats = matches;
                refresh($scope.chats, $scope, ChatsFactory, $stateParams.chatId, $stateParams.friendId, $stateParams.friendName);
	    		$scope.$broadcast('scroll.refreshComplete');
            }
    	);
	};

    var filterBarInstance;
    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.publics,
            update: function (filteredItems, filterText) {
                $scope.people = filteredItems;
            },
            filterProperties: 'payee'
        });
    };

    function refresh(chats, $scope, ChatsFactory, chatId, friendId, friendName) {

    	var index;
    	var chatid = myCache.get('thisMemberId');
    //
	    for (index = 0; index < chats.length; ++index) {
	        //
	        var chat = chats[index];
	        chat.isMe = false;
	        chat.isFriend = false;
	        chat.switchRecipier = '';
	        chat.switchSendBy = '';
	        chat.switchSendTo = '';
	        chat.switchSender = '';
	        if (chat.sendBy === chatid) {
	        	chat.switchSendTo = chat.sendTo;
	        	chat.switchRecipier = chat.recipier;
	        	chat.isMe = true;
	        	chat.isFriend = false;
	        } else{
	            chat.switchSendTo = chat.sendBy;
	        	chat.switchRecipier = chat.sender;
	        	chat.isMe = false;
	        	chat.isFriend = true;
	        }
	    }
    }
})
      
.controller('settingCtrl', function($scope) {

})
   
.controller('familyCtrl', function($scope, $state, $stateParams, $filter, PublicsFactory, MembersFactory, $ionicListDelegate, $ionicActionSheet, $ionicPopover, AccountsFactory, PickTransactionServices, $ionicFilterBar) {

	$scope.familys = {};
    MembersFactory.getMemberById($stateParams.memberId).then(function (thisuser) {
    	$scope.firstname = thisuser.firstname;
		$scope.surename = thisuser.surename;
		$scope.fullname = function (){
			return $scope.firstname +" "+ $scope.surename;
		};
		$scope.photo = thisuser.photo;
		$scope.note = thisuser.note;
		
    });

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (fromState.name === "tabsController.family") {
            refresh($scope.transactions, $scope.publics, $scope, AccountsFactory, PublicsFactory, $stateParams.memberId);
        }
    });

    $scope.transactions = [];
    $scope.inEditMode = false;
    $scope.editIndex = 0;
    $scope.publics = [];
    $scope.publics = PublicsFactory.getMemberPublics($stateParams.memberId);
    $scope.publics.$loaded().then(function (x) {
        refresh($scope.publics, $scope, PublicsFactory, $stateParams.memberId);
    }).catch(function (error) {
        console.error("Error:", error);
    });

    

    // SHOW FILTERS - ACTION SHEET
    $scope.moreOptions = function () {
        $ionicActionSheet.show({
            buttons: [
              { text: 'Copy' },
              { text: 'Email' },
              { text: 'Print' }
            ],
            titleText: '<strong>OPTIONS</strong>',
            cancelText: 'Cancel',
            cancel: function () {
                $ionicListDelegate.closeOptionButtons();
            },
            buttonClicked: function (index) {
                $ionicListDelegate.closeOptionButtons();
                return true;
            }
        });
    };

    // GET TRANSACTIONS
    $scope.groups = [];
    $scope.transactions = AccountsFactory.getMemberTransaction($stateParams.memberId);
    $scope.transactions.$loaded().then(function (x) {
        refresh($scope.transactions, $scope, AccountsFactory, $stateParams.memberId);
    }).catch(function (error) {
        console.error("Error:", error);
    });

    var filterBarInstance;
    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.transactions,
            update: function (filteredItems, filterText) {
                $scope.transactions = filteredItems;
            },
            filterProperties: 'payee'
        });
    };

    // SEARCH TRANSACTIONS
    $scope.date = Date.now();
    $scope.today = function () {
    	$scope.transactions = $filter('date')($scope.date, 'MMMM DD, YYYY');
	}

    function refresh(transactions, $scope, AccountsFactory, accountId) {
    //
    var currentDate = '';
    var todaysDate = new Date();
    var previousDay = '';
    var previousYear = '';
    var groupValue = '';
    var todayFlag = false;
    var group = {};
    var format = 'MMMM DD, YYYY';
    var total = 0;
    var cleared = 0;
    var runningBal = 0;
    var income = 0;
    var expense = 0;
    var clearedBal = 0;
    var index;
    //
    for (index = 0; index < transactions.length; ++index) {
        //
        var transaction = transactions[index];
        //
        total++;
        transaction.ClearedClass = '';
        if (transaction.iscleared === true) {
            transaction.ClearedClass = 'transactionIsCleared';
            cleared++;
            if (transaction.type === "Income") {
                if (!isNaN(transaction.amount)) {
                    clearedBal = clearedBal + parseFloat(transaction.amount);
                }
            } else if (transaction.type === "Expense") {
                if (!isNaN(transaction.amount)) {
                    clearedBal = clearedBal - parseFloat(transaction.amount);
                }
            }
            transaction.clearedBal = clearedBal.toFixed(2);
        }
        if (transaction.type === "Income") {
            if (!isNaN(transaction.amount)) {
                runningBal = runningBal + parseFloat(transaction.amount);
                transaction.runningbal = runningBal.toFixed(2);
                income = income + parseFloat(transaction.amount);
            }
        } else if (transaction.type === "Expense") {
            if (!isNaN(transaction.amount)) {
                runningBal = runningBal - parseFloat(transaction.amount);
                transaction.runningbal = runningBal.toFixed(2);
                expense = expense + parseFloat(transaction.amount);
            }
        }
    }
    $scope.totalCount = total;
    $scope.clearedCount = cleared;
    $scope.pendingCount = total - cleared;
    $scope.currentBalance = runningBal.toFixed(2);
    $scope.clearedBalance = clearedBal.toFixed(2);
    $scope.income = income.toFixed(2);
    $scope.expense = expense.toFixed(2);

    if (runningBal > 0) {
        $scope.BalanceClass = 'balanced';
    } else if (runningBal < 0){
        $scope.BalanceClass = 'assertive';
    } else {
        $scope.BalanceClass = 'dark';
    }
    }
    
})

.controller('friendCtrl', function($scope, $state, $stateParams, $filter, PublicsFactory, MembersFactory, $ionicListDelegate, $ionicActionSheet, $ionicPopover, AccountsFactory, PickTransactionServices, $ionicFilterBar) {

	$scope.friends = {};
    MembersFactory.getMemberById($stateParams.friendId).then(function (thisuser) {
    	$scope.firstname = thisuser.firstname;
		$scope.surename = thisuser.surename;
		$scope.fullname = function (){
			return $scope.firstname +" "+ $scope.surename;
		};
		
    });

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (fromState.name === "tabsController.friend") {
            refresh($scope.friends, $scope, AccountsFactory, PublicsFactory, $stateParams.friendId);
        }
    });

    $scope.publics = [];
    $scope.publics = PublicsFactory.getMemberPublics($stateParams.friendId);
    $scope.publics.$loaded().then(function (x) {
        refresh($scope.publics, $scope, PublicsFactory, $stateParams.friendId);
    }).catch(function (error) {
        console.error("Error:", error);
    });

       

    function refresh(transactions, $scope, AccountsFactory, accountId) {}
    
})
   
.controller('chatCtrl', function($scope, $state, $stateParams, ChatsFactory, myCache, CurrentUserService, ChatService) {

	$scope.messages = [];
	$scope.chatId = $stateParams.chatId;
	$scope.sendTo = $stateParams.friendId;
	$scope.recipier = $stateParams.friendName;
	$scope.sender = CurrentUserService.firstname;
	$scope.txt = "Type your message";
	$scope.myId = myCache.get('thisMemberId');
    $scope.message = {
        toSend: ''
    };
    $scope.$on('$ionicView.beforeEnter', function () {
    	refresh($scope.messages, $scope, ChatsFactory, $scope.myId, $stateParams.friendId, $stateParams.friendName);
    });

    if ($scope.chatId !== '') {
    
	    $scope.messages = ChatsFactory.getChatsById($scope.chatId);
	    $scope.messages.$loaded().then(function (x) {
	        refresh($scope.messages, $scope, ChatsFactory, $scope.myId, $stateParams.friendId, $stateParams.friendName);
	    }).catch(function (error) {
	        console.error("Error:", error);
	    });
	}

	$scope.doRefresh = function() {
		$scope.chats = ChatsFactory.getNewChatsById($scope.chatId);
		$scope.chats.$loaded().then(function (x) {
	        refresh($scope.messages, $scope, ChatsFactory, $scope.myId, $stateParams.friendId, $stateParams.friendName);
	        $scope.messages = $scope.chats.concat($scope.messages);
	    	$scope.$broadcast('scroll.refreshComplete');
	    }).catch(function (error) {
	        console.error("Error:", error);
	    });
	};

	
    $scope.send = function (message) {

    	if ($stateParams.isNew === '') {

    		var mtoSend = message.toSend;

	        /* VALIDATE DATA */
	        if (!mtoSend) {
	            $scope.hideValidationMessage = false;
	            $scope.validationMessage = "No message to send"
	            return;
	        }
	        
	        $scope.newChat = ChatsFactory.sendToMessage(message, $stateParams.friendId, $scope.chatId, $stateParams.friendName);
	        $scope.newChat.$loaded().then(function (x) {
	        	refresh($scope.messages, $scope, ChatsFactory, $scope.myId, $stateParams.friendId, $stateParams.friendName);
		    }).catch(function (error) {
		        console.error("Error:", error);
		    });
		    
		    $scope.message.toSend = "";

	    } else {

	        var mtoSend = message.toSend;

	        /* VALIDATE DATA */
	        if (!mtoSend) {
	            $scope.hideValidationMessage = false;
	            $scope.validationMessage = "No message to send"
	            return;
	        }
	        $scope.newChat = ChatsFactory.sendMessage(message, $stateParams.friendId, $stateParams.friendName);
	        $scope.newChat.$loaded().then(function (x) {
	        	$stateParams.isNew = false;
	        	$scope.chatId = ChatService.selectChat;
	        	refresh($scope.messages, $scope, ChatsFactory, $scope.myId, $stateParams.friendId, $stateParams.friendName);
		    }).catch(function (error) {
		        console.error("Error:", error);
		    });
		    $scope.message.toSend = "";
	    }
        
    };

    function refresh(messages, $scope, ChatsFactory) {

    	var index;
    //
	    for (index = 0; index < messages.length; ++index) {
	        //
	        var message = messages[index];

	        message.isMe = false;
	        message.isFriend = false;
	        if (message.name === $scope.recipier) {
	        	message.isFriend = false;
	        	message.isMe = true;
	        	message.li = "clearfix";
	        	message.divli = "message-data align-right";
	        	message.divme = "message other-message float-right";
	        } else if (message.name === $scope.sender) {
	        	message.isFriend = true;
	            message.isMe = false;
	            message.li = "";
	        	message.divli = "message-data";
	        	message.divme = "message my-message";
	        }
	    }
    }

})
   
.controller('profileCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, MembersFactory, CurrentUserService, PickTransactionServices, $cordovaCamera, $ionicActionSheet, $cordovaDevice, $cordovaFile, $ionicPopup, myCache) {

  $scope.user = {};
  $scope.isphoto = false;
  $scope.firstname = CurrentUserService.firstname;
  $scope.surename = CurrentUserService.surename;
  $scope.phone = CurrentUserService.phone;
  $scope.photo = CurrentUserService.photo;
  $scope.currentItem = {'photo': ''};
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.hideValidationMessage = true;
      $scope.currentItem.photo = PickTransactionServices.photoSelected;
      if ($scope.currentItem.photo === '') {
          $scope.currentItem.photo = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      }
  });

  $scope.doAction = function() {

    $scope.hideSheet = $ionicActionSheet.show({

      buttons: [
            { text: '<i class="icon ion-camera"></i> Take Picture' },
            { text: '<i class="icon ion-images"></i> Choose Album' },
        ],
      buttonClicked: function(index) {
        switch (index) {
                case 0:
                    $scope.currentItem = { photo: PickTransactionServices.photoSelected };
                
                    var options = {
                      quality: 75,
                      destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: Camera.PictureSourceType.CAMERA,
                      allowEdit: false,
                      encodingType: Camera.EncodingType.JPEG,
                      popoverOptions: CameraPopoverOptions,
                      targetWidth: 800,
                      targetHeight: 800,
                      saveToPhotoAlbum: false
                    };
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.currentItem.photo = imageData;
                        $scope.isphoto = true;
                    }, function (error) {
                        console.error(error);
                    })

                break;
                case 1:
                  $scope.currentItem = { photo: PickTransactionServices.photoSelected };
                    var options = {
                      quality: 75,
                      destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                      allowEdit: false,
                      encodingType: Camera.EncodingType.JPEG,
                      popoverOptions: CameraPopoverOptions,
                      targetWidth: 800,
                      targetHeight: 800,
                      saveToPhotoAlbum: false
                    };
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.currentItem.photo = imageData;
                        $scope.isphoto = true;
                    }, function (error) {
                        console.error(error);
                    })
              
                break;
              }
              return true;
        },
      cancelText: 'Cancel',
        cancel: function() {
        console.log('CANCELLED');}
    }); 
  }
   
  $scope.createMember = function (user) {

      var userId = myCache.get('thisMemberId');

      // Validate form data
      if (typeof user.firstname === 'undefined' || user.firstname === '') {
          $scope.hideValidationMessage = false;
          user.firstname = CurrentUserService.firstname;
          return;
      }
      if (typeof user.surename === 'undefined' || user.surename === '') {
          $scope.hideValidationMessage = false;
          user.surename = CurrentUserService.surename;
          return;
      }
      if (typeof user.phone === 'undefined' || user.phone === '') {
          $scope.hideValidationMessage = false;
          user.phone = CurrentUserService.phone;
          return;
      }

      $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner><br>Updating...'
      });

      
      var photo = $scope.currentItem.photo;
      if (typeof photo === 'undefined') {
        photo = CurrentUserService.photo;
      }
      /* PREPARE DATA FOR FIREBASE*/
      $scope.temp = {
          firstname: user.firstname,
          surename: user.surename,
          phone: user.phone,
          photo: photo,
          datecreated: Date.now(),
          dateupdated: Date.now()
      }


      /* SAVE MEMBER DATA */
      var membersref = MembersFactory.ref();
      var newUser = membersref.child(userId);
      newUser.update($scope.temp, function (ref) {
      addImage = newUser.child("images");
      });

      MembersFactory.updateMember(userId).then(function (thisuser) {

        $scope.firstname = thisuser.firstname;
        $scope.surename = thisuser.surename;
        $scope.fullname = function (){
          return $scope.firstname +" "+ $scope.surename;
        };
          
          /* Save user data for later use */
          myCache.put('thisUserName', $scope.fullname());
          CurrentUserService.updateUser(thisuser);
      });

      $ionicLoading.hide();
      $ionicHistory.goBack();
  };

})
   
.controller('newAccountCtrl', function($scope) {

})

.controller('registerCtrl', function($scope, $state, $ionicLoading, MembersFactory, CurrentUserService, PickTransactionServices, $cordovaCamera, $ionicActionSheet, $cordovaDevice, $cordovaFile, $ionicPopup, myCache) {

	$scope.user = {};
	$scope.currentItem = {'photo': ''};
	$scope.$on('$ionicView.beforeEnter', function () {
        $scope.hideValidationMessage = true;
        $scope.currentItem.photo = PickTransactionServices.photoSelected;
        if ($scope.currentItem.photo === '') {
            $scope.currentItem.photo = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        }
    });
    $scope.goToLogIn = function () {
        $state.go('login');
    };

    $scope.doAction = function() {
	
		$scope.hideSheet = $ionicActionSheet.show({

			buttons: [
        		{ text: '<i class="icon ion-camera"></i> Take Picture' },
        		{ text: '<i class="icon ion-images"></i> Choose Album' },
    		],
			buttonClicked: function(index) {
				switch (index) {
                case 0:
                    $scope.currentItem = { photo: PickTransactionServices.photoSelected };
        				
            				var options = {
			                quality: 75,
			                destinationType: Camera.DestinationType.DATA_URL,
			                sourceType: Camera.PictureSourceType.CAMERA,
			                allowEdit: false,
			                encodingType: Camera.EncodingType.JPEG,
			                popoverOptions: CameraPopoverOptions,
			                targetWidth: 800,
			                targetHeight: 800,
			                saveToPhotoAlbum: false
            				};
				            $cordovaCamera.getPicture(options).then(function (imageData) {
				                $scope.currentItem.photo = imageData;
				            }, function (error) {
				                console.error(error);
				            })

                break;
                case 1:
                	$scope.currentItem = { photo: PickTransactionServices.photoSelected };
            				var options = {
			                quality: 75,
			                destinationType: Camera.DestinationType.DATA_URL,
			                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			                allowEdit: false,
			                encodingType: Camera.EncodingType.JPEG,
			                popoverOptions: CameraPopoverOptions,
			                targetWidth: 800,
			                targetHeight: 800,
			                saveToPhotoAlbum: false
            				};
				            $cordovaCamera.getPicture(options).then(function (imageData) {
				                $scope.currentItem.photo = imageData;
				            }, function (error) {
				                console.error(error);
				            })
        			
                break;
            	}
            	return true;
    		},
			cancelText: 'Cancel',
				cancel: function() {
				console.log('CANCELLED');}
		});	
	}
   
    $scope.createMember = function (user) {
        var email = user.email;
        var password = user.password;

        // Validate form data
        if (typeof user.firstname === 'undefined' || user.firstname === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter your first name"
            return;
        }
        if (typeof user.surename === 'undefined' || user.surename === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter your surename"
            return;
        }
        if (typeof user.email === 'undefined' || user.email === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter your email"
            return;
        }
        if (typeof user.password === 'undefined' || user.password === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter your password"
            return;
        }
        if (typeof user.phone === 'undefined' || user.phone === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter your phone"
            return;
        }
        if (typeof user.birthday === 'undefined' || user.birthday === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter your birthday"
            return;
        }

        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Registering...'
        });

        fb.createUser({
            email: user.email,
            password: user.password
        }, function (error, userData) {
            if (error) {
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        $ionicLoading.hide();
                        $ionicPopup.alert({title: 'Register Failed', template: 'The email entered is already in use!'});
                        break;
                    case "INVALID_EMAIL":
                        $ionicLoading.hide();
                        $ionicPopup.alert({title: 'Register Failed', template: 'The specified email is not a valid email!'});
                        break;
                    default:
                        $ionicLoading.hide();
                        $ionicPopup.alert({title: 'Register Failed', template: 'Oops. Something went wrong!'});
                }
            } else {
                fb.authWithPassword({
                    "email": user.email,
                    "password": user.password
                }, function (error, authData) {
                    if (error) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({title: 'Register Failed', template: 'Error. Login failed!'});
                    } else {

                    	if ($scope.currentItem.photo === 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==') {
            					$scope.currentItem.photo = '';
        				}
        				var photo = $scope.currentItem.photo;
        				if (typeof photo === 'undefined') {
        					photo = '';
        				}


                    	/* PREPARE DATA FOR PUBLICS*/
                    	var post = {
                            name: user.firstname,
                            location: 'zezi',
                            userid: authData.uid,
                            note: 'Welcome to zezi, your personal financial application. Share your moment to control your money',
                            photo: photo,
                            date: Date.now(),
                            likes:'',
                            views:'',
                            comments:''
                        }
                        /*SAVE FIRST POSTING*/
                        var ref = fb.child("publics");
                        var newChildRef = ref.push(post);


                        /* PREPARE DATA FOR FIREBASE*/
                        $scope.temp = {
                            firstname: user.firstname,
                            surename: user.surename,
                            email: user.email,
                            phone: user.phone,
                            birthday: user.birthday,
                            group_id: '',
                            photo: photo,
                            datecreated: Date.now(),
                            dateupdated: Date.now()
                        }


                        /* SAVE MEMBER DATA */
                        var membersref = MembersFactory.ref();
                        var newUser = membersref.child(authData.uid);
                        newUser.update($scope.temp, function (ref) {
                    		addImage = newUser.child("images");
                        });

                        /* SAVE DEFAULT ACCOUNT TYPES */
                		var refTypes = fb.child("members").child(authData.uid).child("member_account_types");
                		refTypes.push({ name: 'Savings', icon: 'ion-ios-briefcase' });
                		refTypes.push({ name: 'Credit Card', icon: 'ion-closed-captioning' });
                		refTypes.push({ name: 'Debit Card', icon: 'ion-card' });

                		MembersFactory.getMember(authData).then(function (thisuser) {

		                	$scope.firstname = thisuser.firstname;
		    				$scope.surename = thisuser.surename;
		    				$scope.fullname = function (){
		    					return $scope.firstname +" "+ $scope.surename;
		    				};
		                    
		                    /* Save user data for later use */
		                    myCache.put('thisGroupId', thisuser.group_id);
		                    myCache.put('thisUserName', $scope.fullname());
		                    myCache.put('thisMemberId', authData.uid);
		                    myCache.put('thisPublicId', thisuser.public_id);
		                    CurrentUserService.updateUser(thisuser);
		                });

                        $ionicLoading.hide();
                        $state.go('groupchoice');
                    }
                });
            }
        });
    };

})

.controller('groupChoiceCtrl', function ($scope, $ionicHistory) {

    /* Clear the history stack to prevent going back to login view again */
    $ionicHistory.clearHistory();

})

.controller('groupCreateCtrl', function ($scope, $state, GroupFactory, myCache) {

    $scope.hideValidationMessage = true;
    $scope.group = {
        name: ''
    };

    $scope.publicId = myCache.get('thisPublicId');
    $scope.memberId = myCache.get('thisMemberId');

    $scope.saveGroup = function (group) {

        var group_name = group.name;

        $scope.publicId = myCache.get('thisPublicId');
    	$scope.memberId = myCache.get('thisMemberId');

        /* VALIDATE DATA */
        if (!group_name) {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter a name for this group"
            return;
        }else {
        $scope.hideValidationMessage = true;
        GroupFactory.createGroup(group);
        $state.go('tabsController.people', { memberPublicId: $scope.publicId, memberId: $scope.memberId });
    	}
    };

})

.controller('groupJoinCtrl', function ($scope, $state, GroupFactory, myCache) {

    $scope.hideValidationMessage = true;
    $scope.group = {
        groupid: ''
    };

    $scope.publicId = myCache.get('thisPublicId');
    $scope.memberId = myCache.get('thisMemberId');


    $scope.joinGroup = function (group) {
        var group_code = group.groupid;

        /* VALIDATE DATA */
        if (!group_code) {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter the group code you want to join"
            return;
        }
        GroupFactory.getGroupByCode(group_code).then(function (value) {
            if (value) {
                GroupFactory.joinGroup(value);
                $state.go('tabsController.people', { memberPublicId: $scope.publicId, memberId: $scope.memberId });
            }
        });
    };

})
   
.controller('accountNameCtrl', function($scope) {

})
   
.controller('accountsCtrl', function($scope, $state, $ionicListDelegate, $ionicActionSheet, AccountsFactory, SelectAccountServices) {

    $scope.accounts = [];
    $scope.networth = '';
    $scope.inEditMode = false;
    $scope.editIndex = 0;
    $scope.uid = '';

    // SWIPE
    $scope.listCanSwipe = true;
    $scope.handleSwipeOptions = function ($event, account) {
        $event.stopPropagation();
        var options = $event.currentTarget.querySelector('.item-options');
        if (!options.classList.contains('invisible')) {
            $ionicListDelegate.closeOptionButtons();
        } else {
            $state.go('tabsController.transactions', { accountId: account.$id, accountName: account.accountname });
        }
    };

    // CREATE ACCOUNT
    $scope.createAccount = function () {
        SelectAccountServices.nameSelected = '';
        SelectAccountServices.amountSelected = '';
        SelectAccountServices.typeSelected = '';
        SelectAccountServices.dateSelected = '';
        $state.go('tabsController.account', { accountId: '-1', isNew: 'True' });
    }

    // LIST
    $scope.accounts = AccountsFactory.getAccounts();

    // EDIT
    $scope.editAccount = function (account) {
        $ionicListDelegate.closeOptionButtons();
        $state.go('tabsController.account', { isNew: 'False', accountId: account.$id });
    };

    // DELETE
    $scope.deleteAccount = function (account) {
        $ionicActionSheet.show({
            destructiveText: 'Delete Account',
            titleText: 'Are you sure you want to delete ' + account.accountname + '? This will permanently delete the account from the app.',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function () {
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                //
                // Delete transaction
                //
                var transactionid = account.transactionid;
                var accountid = account.$id;
                $scope.accounts.$remove(account).then(function (newChildRef) {
                    AccountsFactory.deleteTransaction(accountid, transactionid);
                })
                return true;
                return true;
            }
        });
    };

    // WATCH
    $scope.$watch('accounts', function () {
        var clearedBal = 0;
        var netWorth = 0;
        angular.forEach($scope.accounts, function (account) {
            account.BalanceClass = '';
            clearedBal = parseFloat(account.balancecleared);
            netWorth = netWorth + clearedBal;
            if (clearedBal > 0) {
                account.BalanceClass = 'textGreen';
            } else if (clearedBal < 0){
                account.BalanceClass = 'textRed';
            } else {
                account.BalanceClass = 'textBlack';
            }
        })
        $scope.netWorth = netWorth.toFixed(2);
    }, true);

})

.controller('accountCtrl', function ($scope, $state, $stateParams, AccountsFactory, SelectAccountServices) {

    $scope.hideValidationMessage = true;
    $scope.AccountTitle = '';
    $scope.inEditMode = false;
    $scope.DisplayDate = '';
    $scope.currentItem = {
        'accountname': '',
        'accounttype': '',
        'autoclear': 'false',
        'balancecleared': '0',
        'balancetoday': '0',
        'dateopen': ''
    }

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.hideValidationMessage = true;
        $scope.currentItem.accounttype = SelectAccountServices.typeSelected;
        // Handle transaction date
        if (typeof SelectAccountServices.dateSelected !== 'undefined' && SelectAccountServices.dateSelected !== '') {
            $scope.DisplayDate = SelectAccountServices.dateSelected;
        }
    });

    // EDIT / CREATE ACCOUNT
    if ($stateParams.isNew === 'True') {
        $scope.AccountTitle = "Create Account";
    } else {
        // Edit account
        $scope.inEditMode = true;
        var account = AccountsFactory.getAccount($stateParams.accountId);
        $scope.currentItem = account;
        $scope.DisplayDate = moment(account.dateopen).format('MMMM D, YYYY');
        SelectAccountServices.dateSelected = $scope.DisplayDate;
        SelectAccountServices.typeSelected = $scope.currentItem.accounttype;
        $scope.AccountTitle = "Edit Account";
    }

    // SAVE
    $scope.saveAccount = function () {

        // Validate form data
        if (typeof $scope.currentItem.accountname === 'undefined' || $scope.currentItem.accountname === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter a name for this account"
            return;
        }
        if (typeof $scope.currentItem.accounttype === 'undefined' || $scope.currentItem.accounttype === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select an account type"
            return;
        }

        // Format date
        $scope.currentItem.dateopen = Date.now();

        if (typeof $scope.currentItem.dateopen === 'undefined' || $scope.currentItem.dateopen === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a date for this account"
            return;
        }

        if ($scope.inEditMode) {
            //
            // Update Existing Account
            //
            AccountsFactory.saveAccount($scope.currentItem);
            $scope.inEditMode = false;
        } else {
            //
            // Create New Transaction
            //
            AccountsFactory.createNewAccount($scope.currentItem);
        }
        $scope.currentItem = {};
        $state.go('tabsController.accounts');
    }
})

// PICK ACCOUNT TYPE CONTROLLER
.controller('selectAccountTypeCtrl', function ($scope, $ionicHistory, SelectAccountServices, AccountsFactory) {
    $scope.List = AccountsFactory.getAccountTypes();
    $scope.List.$loaded().then(function () { });
    $scope.currentItem = { accounttype: SelectAccountServices.typeSelected };
    $scope.itemchanged = function (accounttype) {
        SelectAccountServices.updateType(accounttype.name);
        $ionicHistory.goBack();
    };
})

.controller('AccountTypesController', function ($scope, $state, $ionicModal, $ionicListDelegate, $ionicActionSheet, AccountsFactory) {

    $scope.inEditMode = false;
    $scope.editIndex = 0;
    $scope.currentItem = {
        name: "",
        icon: "",
    };

    // SORT
    $scope.SortingIsEnabled = false;
    $scope.reorderBtnText = '';
    $scope.enableSorting = function (isEnabled) {
        $scope.SortingIsEnabled = !isEnabled;
        $scope.reorderBtnText = ($scope.SortingIsEnabled ? 'Done' : '');
    };
    $scope.moveItem = function (accounttype, fromIndex, toIndex) {
        $scope.accounttypes.accounttypes.splice(fromIndex, 1);
        $scope.accounttypes.accounttypes.splice(toIndex, 0, accounttype);
    };

    // SWIPE
    $scope.listCanSwipe = true;
    $scope.closeSwipeOptions = function ($event) {
        $event.stopPropagation();
        var options = $event.currentTarget.querySelector('.item-options');
        if (!options.classList.contains('invisible')) {
            $ionicListDelegate.closeOptionButtons();
        } else {
            //Nothing here yet
        }
    };

    // OPEN ACCOUNT SAVE MODAL 
    $ionicModal.fromTemplateUrl('templates/accounttypesave.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal
    })
    $scope.openEntryForm = function (title) {
        $scope.myTitle = title + " Account Type";
        $scope.modal.show();
    }

    // LIST
    $scope.list = function () {
        $scope.accounttypes = AccountsFactory.getAccountTypes();
    }

    // EDIT
    $scope.editItem = function (index) {
        $ionicListDelegate.closeOptionButtons();
        $scope.inEditMode = true;
        $scope.editIndex = index;
        $scope.currentItem = $scope.accounttypes.accounttypes[index];
        $scope.myTitle = "Edit " + $scope.currentItem.name;
        $scope.modal.show();
    };

    // SAVE
    $scope.SaveItem = function () {
        if ($scope.inEditMode) {
            // edit item
            $scope.accounttypes.accounttypes[$scope.editIndex] = $scope.currentItem;
            $scope.inEditMode = false;
        } else {
            // new item
            if ($scope.accounttypes.hasOwnProperty("accounttypes") !== true) {
                $scope.accounttypes.accounttypes = [];
            }
            $scope.accounttypes.accounttypes.push({
                'name': $scope.currentItem.name, 'Icon': $scope.currentItem.Icon
            });
        }
        $scope.currentItem = {};
        $scope.modal.hide();
    }

    // DELETE
    $scope.deleteItem = function (accounttype, index) {
        // Show the action sheet
        $ionicActionSheet.show({
            destructiveText: 'Delete Account',
            titleText: 'Are you sure you want to delete ' + accounttype.name + '? This will permanently delete the account from the app.',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function () {
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                $scope.accounttypes.accounttypes.splice(index, 1);
                return true;
            }
        });
    };
})

.controller('transactionsCtrl', function ($scope, $state, $stateParams, $ionicListDelegate, $ionicActionSheet, $ionicPopover, AccountsFactory, PickTransactionServices, $ionicFilterBar) {

    $scope.transactions = [];
    $scope.AccountTitle = $stateParams.accountName;
    $scope.inEditMode = false;
    $scope.editIndex = 0;

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (fromState.name === "tabsController.transaction") {
            refresh($scope.transactions, $scope, AccountsFactory, $stateParams.accountId);
        }
    });

    // SHOW FILTERS - ACTION SHEET
    $scope.moreOptions = function () {
        $ionicActionSheet.show({
            buttons: [
              { text: 'Copy' },
              { text: 'Email' },
              { text: 'Print' }
            ],
            titleText: '<strong>OPTIONS</strong>',
            cancelText: 'Cancel',
            cancel: function () {
                $ionicListDelegate.closeOptionButtons();
            },
            buttonClicked: function (index) {
                $ionicListDelegate.closeOptionButtons();
                return true;
            }
        });
    };

    // SWIPE
    $scope.listCanSwipe = true;
    $scope.handleSwipeAndTap = function ($event, transaction) {
        $event.stopPropagation();
        var options = $event.currentTarget.querySelector('.item-options');
        if (!options.classList.contains('invisible')) {
            $ionicListDelegate.closeOptionButtons();
        } else {
            var target = event.srcElement;
            if (target.className.contains('toggleTransactionCleared')) {
            } else {
                $state.go('tabsController.transaction', { accountId: $stateParams.accountId, accountName: $stateParams.accountName, transactionId: transaction.$id, transactionName: transaction.payee });
            }
        }
    };

    // CREATE
    $scope.createTransaction = function () {
        PickTransactionServices.typeDisplaySelected = '';
        PickTransactionServices.typeInternalSelected = '';
        PickTransactionServices.categorySelected = '';
        PickTransactionServices.categoryid = '';
        PickTransactionServices.amountSelected = '';
        PickTransactionServices.dateSelected = '';
        PickTransactionServices.payeeSelected = '';
        PickTransactionServices.payeeid = '';
        PickTransactionServices.accountFromSelected = '';
        PickTransactionServices.accountFromId = '';
        PickTransactionServices.accountToSelected = '';
        PickTransactionServices.accountToId = '';
        PickTransactionServices.photoSelected = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        PickTransactionServices.noteSelected = '';
        $state.go('tabsController.transaction', { accountId: $stateParams.accountId, transactionId: '' });
    }

    // GET TRANSACTIONS
    $scope.groups = [];
    $scope.transactions = AccountsFactory.getTransactionsByDate($stateParams.accountId);
    $scope.transactions.$loaded().then(function (x) {
        refresh($scope.transactions, $scope, AccountsFactory, $stateParams.accountId);
    }).catch(function (error) {
        console.error("Error:", error);
    });

    // SET TRANSACTION CLEAR
    $scope.clearTransaction = function (transaction) {
        //
        // Update Existing Transaction
        //
        if (transaction.iscleared) {
            transaction.ClearedClass = 'transactionIsCleared';
        } else {
            transaction.ClearedClass = '';
        }
        $scope.transactions.$save(transaction);

        ////
        //// Update transaction under category
        ////
        //var onComplete = function (error) {
        //    if (error) {
        //        //console.log('Synchronization failed');
        //    }
        //};
        //var categoryTransactionRef = AccountsFactory.getTransactionByCategoryRef(transaction.categoryid, transaction.$id);
        //var categoryTransaction = {
        //    payee: transaction.payee,
        //    amount: transaction.amount,
        //    date: transaction.date,
        //    type: transaction.type,
        //    iscleared: transaction.iscleared
        //};
        //categoryTransactionRef.update(categoryTransaction, onComplete);
        ////
        //// Update transaction under payee
        ////
        //var payeeTransactionRef = AccountsFactory.getTransactionByPayeeRef(transaction.payeeid, transaction.$id);
        //var payeeTransaction = {
        //    payee: transaction.payee,
        //    amount: transaction.amount,
        //    date: transaction.date,
        //    type: transaction.type,
        //    iscleared: transaction.iscleared
        //};
        //payeeTransactionRef.update(payeeTransaction, onComplete);


        //
        refresh($scope.transactions, $scope, AccountsFactory, $stateParams.accountId);
        //
    };

    //
    // SEARCH TRANSACTIONS
    // https://github.com/djett41/ionic-filter-bar
    //
    var filterBarInstance;
    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.transactions,
            update: function (filteredItems, filterText) {
                $scope.transactions = filteredItems;
            },
            filterProperties: 'payee'
        });
    };

    // DELETE
    $scope.deleteTransaction = function (transaction) {
        // Show the action sheet
        $ionicActionSheet.show({
            destructiveText: 'Delete Account',
            titleText: 'Are you sure you want to delete ' + transaction.payee + '? This will permanently delete the transaction from the account',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function () {
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                $ionicListDelegate.closeOptionButtons();

                ////
                //// Delete transaction under category
                ////
                //var categoryTransactionRef = AccountsFactory.getTransactionByCategoryRef(transaction.categoryid, transaction.$id);
                //categoryTransactionRef.remove();
                ////
                //// Delete transaction under payee
                ////
                //var payeeTransactionRef = AccountsFactory.getTransactionByPayeeRef(transaction.payeeid, transaction.$id);
                //payeeTransactionRef.remove();


                //
                // Delete transfer if applicable
                //
                if (transaction.istransfer) {
                    var otherAccountId = '';
                    if ($stateParams.accountId === transaction.accountToId) {
                        otherAccountId = transaction.accountFromId;
                    } else {
                        otherAccountId = transaction.accountToId;
                    }
                    var transferRef = AccountsFactory.getTransactionRef(otherAccountId, transaction.linkedtransactionid);
                    transferRef.remove();
                }
                //
                // Delete transaction
                //
                var alltransactions = AccountsFactory.deleteTransaction();
                alltransactions.$remove(transaction).then(function (ref) {
                    refresh($scope.transactions, $scope, AccountsFactory, $stateParams.accountId);
                });
                return true;
            }
        });
    };

    function refresh(transactions, $scope, AccountsFactory, accountId) {
    //
    var currentDate = '';
    var todaysDate = new Date();
    var previousDay = '';
    var previousYear = '';
    var groupValue = '';
    var todayFlag = false;
    var group = {};
    var format = 'MMMM DD, YYYY';
    var total = 0;
    var cleared = 0;
    var runningBal = 0;
    var clearedBal = 0;
    var index;
    //
    for (index = 0; index < transactions.length; ++index) {
        //
        var transaction = transactions[index];
        //
        // Add grouping functionality
        //
        currentDate = new Date(transaction.date);
        if (!previousDay || currentDate.getDate() !== previousDay || currentDate.getFullYear() !== previousYear) {
            var dividerId = moment(transaction.date).format(format);
            if (dividerId !== groupValue) {
                groupValue = dividerId;
                var tday = moment(todaysDate).format(format);
                //console.log("tday: " + tday + ", " + dividerId);
                if (tday === dividerId) {
                    todayFlag = true;
                } else {
                    todayFlag = false;
                }
                group = {
                    label: groupValue,
                    transactions: [],
                    isToday: todayFlag
                };
                $scope.groups.push(group);
                //console.log(group);
            }
        }
        group.transactions.push(transaction);
        previousDay = currentDate.getDate();
        previousYear = currentDate.getFullYear();
        //
        // Handle Running Balance
        //
        total++;
        transaction.ClearedClass = '';
        if (transaction.iscleared === true) {
            transaction.ClearedClass = 'transactionIsCleared';
            cleared++;
            if (transaction.type === "Income") {
                if (!isNaN(transaction.amount)) {
                    clearedBal = clearedBal + parseFloat(transaction.amount);
                }
            } else if (transaction.type === "Expense") {
                if (!isNaN(transaction.amount)) {
                    clearedBal = clearedBal - parseFloat(transaction.amount);
                }
            }
            transaction.clearedBal = clearedBal.toFixed(2);
        }
        if (transaction.type === "Income") {
            if (!isNaN(transaction.amount)) {
                runningBal = runningBal + parseFloat(transaction.amount);
                transaction.runningbal = runningBal.toFixed(2);
            }
        } else if (transaction.type === "Expense") {
            if (!isNaN(transaction.amount)) {
                runningBal = runningBal - parseFloat(transaction.amount);
                transaction.runningbal = runningBal.toFixed(2);
            }
        }
    }
    $scope.totalCount = total;
    $scope.clearedCount = cleared;
    $scope.pendingCount = total - cleared;
    $scope.currentBalance = runningBal.toFixed(2);
    $scope.clearedBalance = clearedBal.toFixed(2);

    // We want to update account totals
    var account = AccountsFactory.getAccount(accountId);
    $scope.temp = account;
    $scope.temp.balancetoday = runningBal.toFixed(2);
    $scope.temp.balancecurrent = runningBal.toFixed(2);
    $scope.temp.balancecleared = clearedBal.toFixed(2);
    AccountsFactory.saveAccount($scope.temp);
}
})

// PICK TRANSACTION PHOTO CONTROLLER
.controller('pickTransactionPhotoCtrl', function ($scope, $ionicHistory, $cordovaCamera, PickTransactionServices) {
    
    $scope.currentItem = { photo: PickTransactionServices.photoSelected };
    $scope.uploadPhoto = function () {
        if (PickTransactionServices.photoSelected === 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' || PickTransactionServices.photoSelected === '') {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                targetWidth: 800,
                targetHeight: 800,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.currentItem.photo = imageData;
            }, function (error) {
                console.error(error);
            })
        }
    };
    $scope.savePhoto = function () {
        PickTransactionServices.updatePhoto($scope.currentItem.photo);
        $ionicHistory.goBack();
    };
    $scope.removePhoto = function () {
        $scope.currentItem.photo = '';
        PickTransactionServices.updatePhoto('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
        $ionicHistory.goBack();
    }
})

// CATEGORY CONTROLLER
.controller('categoryCtrl', function ($scope, $state, $ionicHistory, $stateParams, CategoriesFactory, PickParentCategoryService, PickCategoryTypeService) {

    $scope.hideValidationMessage = true;
    $scope.inEditMode = false;
    $scope.allowParent = false;
    $scope.currentItem = {
        'categoryname': '',
        'categorytype': '',
        'categoryparent': '',
        'categorysort': ''
    };
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.hideValidationMessage = true;
        $scope.currentItem.categoryparent = PickParentCategoryService.parentcategorySelected;
        $scope.currentItem.categorytype = PickCategoryTypeService.typeSelected;
    });

    // EDIT / CREATE CATEGORY
    if ($stateParams.categoryid === '') {
        // create
        $scope.CategoryTitle = "Create Category";
    } else {
        // edit
        $scope.inEditMode = true;
        CategoriesFactory.getCategory($stateParams.categoryid, $stateParams.type).then(function (category) {
            $scope.currentItem = category;
            PickCategoryTypeService.typeSelected = $scope.currentItem.categorytype;
            PickParentCategoryService.parentcategorySelected = $scope.currentItem.categoryparent;
        });
        $scope.CategoryTitle = "Edit Category";
    }

    // SAVE
    $scope.saveCategory = function () {

        // Validate form data
        if (typeof $scope.currentItem.categoryname === 'undefined' || $scope.currentItem.categoryname === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please type a category name"
            return;
        }
        if (typeof $scope.currentItem.categorytype === 'undefined' || $scope.currentItem.categorytype === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a category type"
            return;
        }

        if ($scope.currentItem.categoryparent === '') {
            $scope.currentItem.categorysort = $scope.currentItem.categoryname.toUpperCase();
        } else {
            $scope.currentItem.categorysort = $scope.currentItem.categoryparent.toUpperCase() + ":" + $scope.currentItem.categoryname.toUpperCase();
        }
        if ($scope.inEditMode) {
            // Update
            var onComplete = function (error) {
                if (error) {
                    //console.log('Synchronization failed');
                }
            };
            var categoryRef = CategoriesFactory.getCategoryRef($stateParams.categoryid, $stateParams.type);
            categoryRef.update($scope.currentItem, onComplete);
            $scope.inEditMode = false;
        } else {
            // Create
            var sync = CategoriesFactory.getCategories($scope.currentItem.categorytype);
            sync.$add($scope.currentItem).then(function (newChildRef) {
                $scope.currentItem = {
                    accountid: newChildRef.key()
                };
            });
        }
        $scope.currentItem = {};
        $ionicHistory.goBack();
    }
})

// CATEGORIES CONTROLLER
.controller('categoriesCtrl', function ($scope, $state, $ionicListDelegate, $ionicActionSheet, CategoriesFactory, PickParentCategoryService, PickCategoryTypeService) {
  
    // SHOW FILTERS - ACTION SHEET
    $scope.moreOptions = function (category) {
        $ionicActionSheet.show({
            buttons: [
              { text: 'Show Transactions' }
            ],
            titleText: '<strong>FILTER</strong>',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
                $ionicListDelegate.closeOptionButtons();
            },
            buttonClicked: function (index) {
                $state.go('app.categorytransactions', { categoryid: category.$id });
                $ionicListDelegate.closeOptionButtons();
                return true;
            }
        });
    };

    // CREATE
    $scope.createCategory = function () {
        PickCategoryTypeService.typeSelected = '';
        PickParentCategoryService.parentcategorySelected = '';
        $state.go('app.category');
    }

    // SWIPE
    $scope.listCanSwipe = true;
    $scope.handleSwipeAndTap = function ($event, category) {
        $event.stopPropagation();
        var options = $event.currentTarget.querySelector('.item-options');
        if (!options.classList.contains('invisible')) {
            $ionicListDelegate.closeOptionButtons();
        } else {
            $state.go('app.category', { categoryid: category.$id, type: category.categorytype });
        }
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.list();
    });

    // GET CATEGORIES
    $scope.list = function () {
        $scope.expensecategories = CategoriesFactory.getCategoriesByTypeAndGroup('Expense');
        $scope.expensecategories.$loaded().then(function () {
        });
        $scope.incomecategories = CategoriesFactory.getCategoriesByTypeAndGroup('Income');
        $scope.incomecategories.$loaded().then(function () {
        });
    };

    // DELETE
    $scope.deleteCategory = function (category) {
        // Show the action sheet
        $ionicActionSheet.show({
            destructiveText: 'Delete Account',
            titleText: 'Are you sure you want to delete ' + category.categoryname + '? This will permanently delete the account from the app',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                var myButton = index;
                return true;
            },
            destructiveButtonClicked: function () {
                $ionicListDelegate.closeOptionButtons();
                if (category.categorytype === 'Income') {
                    $scope.incomecategories.$remove(category).then(function (newChildRef) {

                    })
                } else {
                    $scope.expensecategories.$remove(category).then(function (newChildRef) {
                        
                    })
                }
                return true;
            }
        });
    };
})

 
.controller('categoriesCtrl', function($scope) {

})
   
.controller('postCtrl', function($scope, $state, $stateParams, MembersFactory, PublicsFactory, $ionicFilterBar, $ionicListDelegate, PickTransactionServices, CurrentUserService, myCache) {

	$scope.posts = [];
    $scope.friends = [];
    $scope.userId = myCache.get('thisMemberId');
    $scope.photo = {
        userid: ''
    };

    $scope.$on('$ionicView.beforeLeave', function () {
        $scope.hideValidationMessage = true;
        $stateParams.memberPublicId = '';
        $stateParams.memberId = '';
    });

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (fromState.name === "tabsController.post") {
            refresh($scope.posts, $scope, MembersFactory, PublicsFactory);
        }
    });

    PublicsFactory.getPublics($stateParams.postId).then(function (post) {
    	$scope.name = post.name;
    	$scope.date = post.date;
    	$scope.location = post.location;
    	$scope.note = post.note;
    	$scope.photo = post.photo;
    	$scope.likes = post.likes;
    	$scope.views = post.views;
    	$scope.comments = post.comments;
    	MembersFactory.getMemberById(post.userid).then(function (user) {
	    	$scope.userphoto = user.photo;
	    });
    });

    

    $scope.doRefresh = function (){

    	$scope.posts = PublicsFactory.getPublics($stateParams.postId);
    	scope.posts.$loaded().then(function (x) {
    	refresh($scope.publics, $scope, PublicsFactory, $stateParams.postId);
	        $scope.$broadcast('scroll.refreshComplete');
	    }).catch(function (error) {
	        console.error("Error:", error);
	    });

    };

    function refresh(posts, $scope, MembersFactory, PublicsFactory) {
    
    }

})
   
.controller('familyMemberCtrl', function($scope, $state, $ionicPlatform, $ionicListDelegate, $ionicActionSheet, MembersFactory, SelectAccountServices, CurrentUserService, myCache) {

	$scope.members = [];
	$scope.groups = myCache.get('thisGroupId');
	$scope.AccountTitle = CurrentUserService.group_name;

    // SWIPE
    $scope.listCanSwipe = true;
    $scope.handleSwipeOptions = function ($event, member) {
        $state.go('tabsController.family', { memberPublicId: member.public_id, memberId: member.$id, memberName: member.firstname });
    };

    // LIST
    MembersFactory.getMemberByCode($scope.groups).then(
            function (matches) {
                $scope.members = matches;
            }
    )

    $scope.profil = function (){
		
		angular.element(document).ready(function() {

		  document.getElementById(".friends").each(function() {
		    document.getElementById(this).click(function() {
		      var childOffset = document.getElementById(this).offset();
		      var parentOffset = document.getElementById(this).parent().parent().offset();
		      var childTop = childOffset.top - parentOffset.top;
		      var clone = document.getElementById(this).find('img').eq(0).clone();
		      var top = childTop + 12 + "px";

		      document.getElementById(clone).css({
		        'top': top
		      }).addClass("floatingImg").appendTo("#chatbox");

		      setTimeout(function() {
		        document.getElementById("#profile p").addClass("animate");
		        document.getElementById("#profile").addClass("animate");
		      }, 100);
		      setTimeout(function() {
		        document.getElementById("#chat-messages").addClass("animate");
		        document.getElementById('.cx, .cy').addClass('s1');
		        setTimeout(function() {
		          document.getElementById('.cx, .cy').addClass('s2');
		        }, 100);
		        setTimeout(function() {
		          document.getElementById('.cx, .cy').addClass('s3');
		        }, 200);
		      }, 150);

		      document.getElementById('.floatingImg').animate({
		        'width': "68px",
		        'left': '108px',
		        'top': '20px'
		      }, 200);

		      var name = document.getElementById(this).find("p strong").html();
		      var email = document.getElementById(this).find("p span").html();
		      document.getElementById("#profile p").html(name);
		      document.getElementById("#profile span").html(email);

		      document.getElementById(".message").not(".right").find("img").attr("src", document.getElementById(clone).attr("src"));
		      document.getElementById('#friendslist').fadeOut();
		      document.getElementById('#chatview').fadeIn();

		      document.getElementById('#close').unbind("click").click(function() {
		        document.getElementById("#chat-messages, #profile, #profile p").removeClass("animate");
		        document.getElementById('.cx, .cy').removeClass("s1 s2 s3");
		        document.getElementById('.floatingImg').animate({
		          'width': "40px",
		          'top': top,
		          'left': '12px'
		        }, 200, function() {
		          document.getElementById('.floatingImg').remove()
		        });

		        setTimeout(function() {
		          document.getElementById('#chatview').fadeOut();
		          document.getElementById('#friendslist').fadeIn();
		        }, 50);
		      });

		    });
		  });
		});			
	};
})
   
.controller('incomeCtrl', function($scope) {

})
   
.controller('recurringCtrl', function($scope) {

})
   
.controller('expenseCtrl', function($scope) {

})
   
.controller('newIncomeCategoryCtrl', function($scope) {

})
   
.controller('newExpenseCategoryCtrl', function($scope) {

})

.controller('newBudgetCtrl', function($scope) {

})
   
.controller('newRecurringCtrl', function($scope) {

})
   
.controller('aboutCtrl', function($scope) {

})
   
.controller('loginCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $cacheFactory, $ionicLoading, $ionicPopup, $state, MembersFactory, myCache, CurrentUserService) {

	

	$scope.user = {};
    $scope.doLogIn = function (user) {
        $ionicLoading.show({
            template: '<ion-spinner icon="ios"></ion-spinner><br>Loggin In...'
        });

        /* Check user fields*/
        if (!user.email || !user.password) {
            $ionicLoading.hide();
            $ionicPopup.alert({title: 'Login Failed', template: 'Please check your Email or Password!'});
            return;
        }

        /* Authenticate User */
        fb.authWithPassword({
            "email": user.email,
            "password": user.password
        }, function (error, authData) {
            if (error) {
                //console.log("Login Failed!", error);
                $ionicLoading.hide();
                $ionicPopup.alert({title: 'Login Failed', template: 'Check your credentials and try again!'});
            } else {
                
                MembersFactory.getMember(authData).then(function (thisuser) {

                	$scope.firstname = thisuser.firstname;
    				$scope.surename = thisuser.surename;
    				$scope.fullname = function (){
    					return $scope.firstname +" "+ $scope.surename;
    				};
                    
                    /* Save user data for later use */
                    myCache.put('thisGroupId', thisuser.group_id);
                    myCache.put('thisUserName', $scope.fullname());
                    myCache.put('thisMemberId', authData.uid);
                    myCache.put('thisPublicId', thisuser.public_id);
                    CurrentUserService.updateUser(thisuser);

                    if (thisuser.group_id === '') {
                        $ionicLoading.hide();
                        $state.go('groupchoice');
                    } else {
                        $ionicLoading.hide();
                        $state.go('tabsController.people', { memberPublicId: thisuser.public_id, memberId: authData.uid });
                    }
                });
            }
        });
    }

})

.controller('autoLoginCtrl', function($scope) {

})


 