(function(){
      if (sessionStorage.getItem('sidebarExpanded') === 'true') {
        document.documentElement.classList.add('sidebar-expanded');
      }
    })();

        document.addEventListener('DOMContentLoaded', function(){
      var sb = document.querySelector('.sidebar');
      sb.addEventListener('mouseenter', function(){
        document.documentElement.classList.add('sidebar-expanded');
        sessionStorage.setItem('sidebarExpanded', 'true');
      });
      sb.addEventListener('mouseleave', function(){
        document.documentElement.classList.remove('sidebar-expanded');
        sessionStorage.setItem('sidebarExpanded', 'false');
      });
    });