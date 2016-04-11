angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    cache: false,
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('loginauto', {
    url: "/",
    cache: false,
    templateUrl: "templates/loginauto.html",
    controller: 'autoLoginCtrl'
  })

  .state('Register', {
    url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
  })

  .state('groupchoice', {
          url: '/groupchoice',
          templateUrl: 'templates/groupChoice.html',
          controller: 'groupChoiceCtrl'
  })

  .state('groupcreate', {
          url: '/groupcreate',
          templateUrl: 'templates/groupCreate.html',
          controller: 'groupCreateCtrl'
      })

  .state('tabsController', {
    url: '/zezi',
    templateUrl: 'templates/tabsController.html',
    abstract:true,
    controller: 'AppCtrl'
  })

  .state('tabsController.people', {
    url: '/people',
    chace: true,
    views: {
      'tab1': {
        templateUrl: 'templates/people.html',
        controller: 'peopleCtrl'
      }
    }
  })

  .state('tabsController.notification', {
    url: '/notification',
    chace: true,
    views: {
      'tab2': {
        templateUrl: 'templates/notification.html',
        controller: 'notificationCtrl'
      }
    }
  })

  .state('tabsController.chitChat', {
    url: '/chitChat',
    chace: true,
    views: {
      'tab3': {
        templateUrl: 'templates/chitChat.html',
        controller: 'chitChatCtrl'
      }
    }
  })

  

  .state('tabsController.setting', {
    url: '/setting',
    chace: true,
    views: {
      'tab4': {
        templateUrl: 'templates/setting.html',
        controller: 'settingCtrl'
      }
    }
  })
  
  .state('tabsController.familyMember', {
    url: '/familyMember',
    chace: true,
    views: {
      'tab5': {
        templateUrl: 'templates/familyMember.html',
        controller: 'familyMemberCtrl'
      }
    }
  })

  .state('tabsController.family', {
    url: '/family',
    views: {
      'tab5': {
        templateUrl: 'templates/family.html',
        controller: 'familyCtrl'
      }
    }
  })

  .state('tabsController.profile', {
    url: '/profile',
    views: {
      'tab4': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })
  
  .state('tabsController.newBudget', {
    url: '/newBudget',
	views: {
      'tab4': {
    	templateUrl: 'templates/newBudget.html',
    	controller: 'newBudgetCtrl'
	  }
	}
  })

  .state('tabsController.newIncomeCategory', {
    url: '/newIncomeCategory',
	views: {
      'tab4': {
    	templateUrl: 'templates/newIncomeCategory.html',
    	controller: 'newIncomeCategoryCtrl'
	  }
	}
  })
  
  .state('tabsController.newRecurring', {
    url: '/newRecurring',
	views: {
      'tab4': {
    	templateUrl: 'templates/newRecurring.html',
    	controller: 'newRecurringCtrl'
	  }
	}
  })
  
  .state('tabsController.categories', {
    url: '/categories',
    views: {
      'tab4': {
        templateUrl: 'templates/categories.html',
        controller: 'categoriesCtrl'
      }
    }
  })

  .state('tabsController.post', {
    url: '/post',
    views: {
      'tab2': {
        templateUrl: 'templates/post.html',
        controller: 'postCtrl'
      }
    }
  })
  
  .state('tabsController.newExpense', {
    url: '/newExpense',
	views: {
      'tab4': {
    	templateUrl: 'templates/newExpenseCategory.html',
    	controller: 'newExpenseCategoryCtrl'
	  }
	}
  })
  
  .state('tabsController.accounts', {
    url: '/accounts',
    cache: true,
    views: {
      'tab4': {
        templateUrl: 'templates/accounts.html',
        controller: 'accountsCtrl'
      }
    }
  })

  .state('tabsController.account', {
        url: "/accounts/account/:accountId/:isNew",
        views: {
            'tab4': {
                templateUrl: "templates/account.html",
                controller: 'accountCtrl'
            }
        }
  })

  .state('tabsController.pickaccountdate', {
        url: "/pickaccountdate",
        views: {
            'tab4': {
                templateUrl: "templates/pickaccountdate.html",
                controller: "selectAccountDateCtrl"
            }
        }
  })

  .state('tabsController.pickaccounttype', {
        url: "/pickaccounttype",
        views: {
            'tab4': {
                templateUrl: "templates/pickaccounttype.html",
                controller: "selectAccountTypeCtrl"
            }
        }
  })

  .state('tabsController.transactions', {
        url: "/accounts/:accountId/:accountName",
        cache: true,
        views: {
            'tab4': {
                templateUrl: "templates/transactions.html",
                controller: 'transactionsCtrl'
            }
        }
  })

  .state('tabsController.transaction', {
        url: "/transactions/:accountId/:accountName/:transactionId",
        views: {
            'tab4': {
                templateUrl: "templates/transaction.html",
                controller: 'transactionCtrl'
            }
        }
  })

  .state('tabsController.picktransactiontype', {
        url: "/picktransactiontype",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactiontype.html",
                controller: "pickTransactionTypeCtrl"
            }
        }
    })
    .state('tabsController.picktransactionaccountfrom', {
        url: "/picktransactionaccountfrom",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactionaccountfrom.html",
                controller: "pickTransactionAccountFromCtrl"
            }
        }
    })
    .state('tabsController.picktransactionaccountto', {
        url: "/picktransactionaccountto",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactionaccountto.html",
                controller: "pickTransactionAccountToCtrl"
            }
        }
    })
    .state('tabsController.picktransactionpayee', {
        url: "/picktransactionpayee",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactionpayee.html",
                controller: "pickTransactionPayeeCtrl"
            }
        }
    })
    .state('tabsController.picktransactioncategory', {
        url: "/picktransactioncategory",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactioncategory.html",
                controller: "pickTransactionCategoryCtrl"
            }
        }
    })
    .state('tabsController.picktransactiondate', {
        url: "/picktransactiondate",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactiondate.html",
                controller: "pickTransactionDateCtrl"
            }
        }
    })
    .state('tabsController.picktransactionamount', {
        url: "/picktransactionamount",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactionamount.html",
                controller: "pickTransactionAmountCtrl"
            }
        }
    })
    .state('tabsController.picktransactionphoto', {
        url: "/picktransactionphoto",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactionphoto.html",
                controller: "pickTransactionPhotoCtrl"
            }
        }
    })
    .state('tabsController.picktransactionnote', {
        url: "/picktransactionnote",
        views: {
            'tab4': {
                templateUrl: "templates/picktransactionnote.html",
                controller: "pickTransactionNoteCtrl"
            }
        }
    })

  .state('tabsController.category', {
        url: "/category/:categoryid/:type",
        views: {
            'tab4': {
                templateUrl: "templates/category.html",
                controller: 'categoryCtrl'
            }
        }
  })

  .state('tabsController.pickcategorytype', {
        url: "/pickcategorytype",
        views: {
            'tab4': {
                templateUrl: "templates/pickcategorytype.html",
                controller: "pickCategoryTypeCtrl"
            }
        }
  })
  .state('tabsController.pickparentcategory', {
        url: "/pickparentcategory",
        views: {
            'tab4': {
                templateUrl: "templates/pickparentcategory.html",
                controller: "pickParentCategoryCtrl"
            }
        }
  })  
  
  .state('tabsController.accountName', {
    url: '/accountName',
    views: {
      'tab4': {
        templateUrl: 'templates/accountName.html',
        controller: 'accountNameCtrl'
      }
    }
  })

  .state('tabsController.newAccount', {
    url: '/newAccount',
    views: {
      'tab4': {
        templateUrl: 'templates/newAccount.html',
        controller: 'newAccountCtrl'
      }
    }
  })

  .state('tabsController.about', {
    url: '/about',
    views: {
      'tab4': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })
  
  .state('personName', {
    url: '/personName',
    templateUrl: 'templates/personName.html',
    controller: 'personNameCtrl'
  })
  
  .state('tabsController.income', {
    url: '/income',
    views: {
      'tab1': {
        templateUrl: 'templates/income.html',
        controller: 'incomeCtrl'
      }
    }
  })
  
  
  .state('tabsController.expense', {
    url: '/expense',
        templateUrl: 'templates/expense.html',
        controller: 'expenseCtrl'
  })
  
  .state('recurring', {
    url: '/recurring',
    templateUrl: 'templates/recurring.html',
    controller: 'recurringCtrl'
  })

  $urlRouterProvider.otherwise('/tabsController');

});