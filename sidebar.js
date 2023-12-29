  function openNav() {
    document.getElementById("mySidebar").style.width = "310px";
    
  }
  
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }
  
  
    // Function to toggle the enforcer dropdown
    function toggleDropdown() {
      var icon = document.querySelector(".dropdown img");
      var dropdown = document.getElementById("dropdownMenu");
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        icon.style.display = "none";
      } else {
        dropdown.style.display = "block";
        icon.style.display = "block";

      }
    }
    // Function to toggle the violations dropdown
    function toggleDropdown2() {
      var icon2 = document.querySelector(".dropdown2 img");
      var dropdown2 = document.getElementById("dropdownMenu2");
      if (dropdown2.style.display === "block") {
        dropdown2.style.display = "none";
        icon2.style.display = "none";
      } else {
        dropdown2.style.display = "block";
        icon2.style.display = "block";

      }
    }
  

  var dropdownLink = document.querySelector(".dropdown");
  var dropdownLink2 = document.querySelector(".dropdown2");
  dropdownLink.addEventListener("click", toggleDropdown);
  dropdownLink2.addEventListener("click", toggleDropdown2);
  window.addEventListener('load', closeNav);