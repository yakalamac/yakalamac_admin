(()=>{
   let lastPchangeEvent = null;
    const changeHandler = e=> {
        const currentTarget = e.currentTarget;
        if(lastPchangeEvent !== undefined) {
            clearTimeout(lastPchangeEvent);
        }
        lastPchangeEvent = setTimeout(()=> {
            window.dispatchEvent(
                new PChangeEvent(
                    Array
                        .from(currentTarget.querySelectorAll('option'))
                        .find(current=> current.selected)
                )
            );
            lastPchangeEvent = undefined;
        }, 1000);
    };
  class PChangeEvent extends Event {
   constructor(current) {
     super('pchange');
     window.activePlace = {
      ...(window.activePlace || {}),
       pid: current.id.trim(),
       pname: current.textContent.trim()
     }
     document.cookie = '_active_place='+encodeURIComponent(JSON.stringify(window.activePlace));
   }
  }
  const i = setInterval(()=>{
    const s = document.querySelector('select#place-list');
    if(s !== undefined) {

      window.currentUser = {
          places : {ownered: [], managed: []},
          exists: placeId => {
              return window.currentUser.find(placeId) !== undefined;
          },
          find: placeId => {
              let founded = window.currentUser.places.ownered.find(p=> p.id === placeId);

              if(founded === undefined) {
                  founded = window.currentUser.places.managed.find(p=> p.id === placeId);
              }

              return founded;
          }
      };

      for(const opt of s.querySelectorAll('optgroup#ownered-places option').values()) {
          const structure = {name: opt.textContent.trim(), id: opt.id.trim()};

          if(window.currentUser.places.ownered.find(p=> p.id === structure.id) === undefined) {
              window.currentUser.places.ownered.push(structure);
          }
      }

      for(const opt of s.querySelectorAll('optgroup#managed-places option').values()) {
          const structure = {name: opt.textContent.trim(), id: opt.id.trim()};

          if(window.currentUser.places.managed.find(p=> p.id === structure.id) === undefined) {
              window.currentUser.places.managed.push(structure);
          }
      }


      s.addEventListener('change', changeHandler);
      clearInterval(i);
      window.addEventListener('pchange', ()=> {
          if(window.stopPchangeEventReload === true) return;
          window.location.reload();
      });
    }
  },10);
  const i2 = setInterval(()=>{
      const input = document.querySelector('#place_active_checkbox_input input[role="switch"]');
      if(input !== undefined) {
          const init = {method:'GET'};

          if(window.activePlace?.pid !== undefined) {
              init.method = 'POST';
              init.body = JSON.stringify({place:window.activePlace.pid});
              init.headers = {
                'Content-Type': 'application/json'
              };
          }

          fetch('/_partner/active/place',init)
              .then(async r=>{
                  window.activePlace.data = await r.json();
                  input.checked = window.activePlace.data?.active === true;
              }).catch(e=>console.error(e));
          clearInterval(i2);
      }
  }, 10);
})();