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

  let attempts = 0;
  const i2 = setInterval(()=>{
      const input = document.querySelector('div#place_active_checkbox_container input[role="switch"]');
      if(input !== undefined && input !== null) {
          const init = {method:'GET'};

          if(window.activePlace?.pid !== undefined) {
              init.method = 'POST';
              init.body = JSON.stringify({place:window.activePlace.pid});
              init.headers = {
                'Content-Type': 'application/json'
              };
          }

          let lastActivityStatus = undefined;
          fetch('/_partner/active/place',init)
              .then(async r=>{
                  window.activePlace.data = await r.json();
                  input.checked = window.activePlace.data?.active === true;
                  lastActivityStatus = input.checked;
              }).catch(e=>console.error(e));

          let requestStorage = undefined;

          input.addEventListener('change', (e)=> {
              console.warn(`Request timeout storage  ${requestStorage}`);
              console.warn(`Last activity status ${lastActivityStatus}`);
              console.warn(`Input checkbox status ${input.checked}`);

                if(requestStorage !== undefined) {
                    console.log('requestStorage is not empty, clearing');
                    clearTimeout(requestStorage);
                }

                console.log('Check diff between lastActivity and current');
                if(input.checked !== lastActivityStatus) {
                    console.log('Activity changed, sending request to server to update');

                    requestStorage = setTimeout(()=>{
                        console.log(`Fetch to server`);
                        fetch('/_partner/update/place/activity', {
                            method: 'POST',
                            headers: {
                                'Content-Type' : 'application/json'
                            },
                            body: JSON.stringify({active: input.checked, place: window.activePlace.pid})
                        })
                            .then(async response=> console.log(await response.json()))
                            .catch(e=>console.error(e));
                        }, 1000);

                    console.log(`Adjusted timeout ${requestStorage}`);
                } else {
                    console.log('Nothing to change')
                }
          });
          clearInterval(i2);
      } else {
          attempts++;
          if(attempts > 10) {
              clearInterval(i2);
              console.error('No place active checkbox found');
          }
      }
  }, 100);
})();