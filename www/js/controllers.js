angular.module('app.controllers', [])

.controller('AppCtrl', function ($scope, $state, $rootScope, $ionicActionSheet, $ionicHistory, $cordovaAppVersion) {

    $scope.showMenuIcon = true;
    $scope.appversion = '1';
    
    document.addEventListener("deviceready", function () {

    $cordovaAppVersion.getVersionNumber().then(function (version) {
            $scope.appversion = version;
        });
    }, false);

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
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                $ionicHistory.clearCache();
                $rootScope.authData = '';
                fb.unauth();
                $state.go('login');
            }
        });
    };
})
  
.controller('peopleCtrl', function($scope, $state, MembersFactory, PublicsFactory, $ionicFilterBar, $ionicListDelegate, PickTransactionServices, CurrentUserService) {

    $scope.publics = [];
    $scope.uid = '';
    $scope.publics = PublicsFactory.getPublics();

    

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
    $scope.handleSwipeOptions = function ($event, account) {
        $event.stopPropagation();
        var options = $event.currentTarget.querySelector('.item-options');
        if (!options.classList.contains('invisible')) {
            $ionicListDelegate.closeOptionButtons();
        } else {
            $state.go('tabsController.transactions', { accountId: account.$id, accountName: account.accountname });
        }
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

})

.controller('postingCtrl', function ($scope, $state, $stateParams, $ionicHistory, AccountsFactory, PickTransactionServices, PayeesService, myCache, CurrentUserService) {

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
        'amount': '',
        'category': '',
        'categoryid': '',
        'date': '',
        'iscleared': false,
        'isrecurring': false,
        'istransfer': false,
        'isphoto': false,
        'notes': '',
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
        if ($scope.currentItem.photo === '') {
            $scope.currentItem.photo = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
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
    	if ($scope.currentItem.amount !== ''){
        	$scope.amount = function (){ return " " + $scope.currentItem.amount;};
    	}
    });

    

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

        // Handle default blank photo
        if ($scope.currentItem.photo === 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==') {
            $scope.currentItem.photo = '';
            $scope.currentItem.isphoto = false;
        } else {
            $scope.currentItem.isphoto = true;
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
            if (isNaN($scope.currentItem.photo)) {
                $scope.currentItem.photo = "";
            }
            // Set current house member
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
   
.controller('chitChatCtrl', function($scope) {

})
      
.controller('settingCtrl', function($scope) {

})
   
.controller('familyCtrl', function($scope) {

})
   
.controller('personNameCtrl', function($scope) {

})
   
.controller('profileCtrl', function($scope) {

})
   
.controller('newAccountCtrl', function($scope) {

})

.controller('registerCtrl', function($scope, $state, $ionicLoading, MembersFactory, PickTransactionServices, $cordovaCamera, $ionicActionSheet, $cordovaDevice, $cordovaFile, $ionicPopup) {

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

                break;
                case 1:
                	$scope.currentItem = { photo: PickTransactionServices.photoSelected };
        				if (PickTransactionServices.photoSelected === 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' || PickTransactionServices.photoSelected === '') {
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
        				}
        			
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

        				/* PREPARE DATA FOR TEMP*/
                    	var temp = {
                            temp: ''
                        }
                        /*SAVE TEMP*/
                        var tempref = fb.child("temps");
                        var newTempRef = tempref.push(temp);


                    	/* PREPARE DATA FOR PUBLICS*/
                    	var post = {
                            name: user.firstname,
                            location: 'zezi',
                            note: 'Welcome to zezi, your personal financial application. Share your moment to control your money',
                            photo: photo,
                            date: Date.now()
                        }
                        /*SAVE FIRST POSTING*/
                        var ref = fb.child("publics").child(newTempRef.key()).child(authData.uid);
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
                            dateupdated: Date.now(),
                            public_id: newTempRef.key()
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

                		/* REMOVE TEMP*/
                		var remTempRef = tempref.remove();

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

.controller('groupCreateCtrl', function ($scope, $state, GroupFactory) {

    $scope.hideValidationMessage = true;
    $scope.group = {
        name: ''
    };

    $scope.saveGroup = function (group) {

        var group_name = group.name;

        /* VALIDATE DATA */
        if (!group_name) {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please enter a name for this group"
            return;
        }
        $scope.hideValidationMessage = true;
        //
        // Create House
        //
        GroupFactory.createGroup(group);
        $state.go('tabsController.accounts');
    };
})

.controller('groupJoinCtrl', function ($scope, $state, GroupFactory) {

    $scope.hideValidationMessage = true;
    $scope.group = {
        groupid: ''
    };

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
                $state.go('tabsController.accounts');
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
   
.controller('postCtrl', function($scope) {

})
   
.controller('familyMemberCtrl', function($scope, $state, $ionicListDelegate, $ionicActionSheet, MembersFactory, SelectAccountServices, myCache) {

	$scope.members = [];
	$scope.groups = myCache.get('thisGroupId');

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

    // LIST
    MembersFactory.getMemberByCode($scope.groups).then(
            function (matches) {
                $scope.members = matches;
            }
    )
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
   
.controller('loginCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $state, MembersFactory, myCache, CurrentUserService) {

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
        var ref = new Firebase("https://zezi.firebaseio.com");
        ref.authWithPassword({
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
                        $state.go('tabsController.people');
                    }
                });
            }
        });
    }

})

.controller('autoLoginCtrl', function($scope) {

})


 