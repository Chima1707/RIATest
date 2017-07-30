(function () {
  'use strict'

  angular
        .module('App')
        .controller('NavbarController', NavbarController)

  NavbarController.$inject = []

  function NavbarController () {
    var vm = this

    vm.isNavbarCollapsed = true

    vm.toggleNavbar = toggleNavbar
    vm.collapseNavbar = collapseNavbar

    function toggleNavbar () {
      vm.isNavbarCollapsed = !vm.isNavbarCollapsed
    }

    function collapseNavbar () {
      vm.isNavbarCollapsed = true
    }
  }
})()
