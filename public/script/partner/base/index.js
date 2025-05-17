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
  const i = setInterval(()=> {
    const s = document.querySelector('select#place-list');
    if(s !== undefined && s !== null && s instanceof HTMLElement) {
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

          const activityChangeAlertModal = $('#place-activity-alert');

          const modalMap = {
              ["true"]: {
                  title: 'İşletmenizi siparişe açın',
                  bodyText: 'İşletmeniz kullanıcılar tarafından açık ve sipariş verilebilir görünecek. Bu işlemi onaylıyor musunuz?',
                  buttonClass: 'btn btn-success'
              },
              ["false"]: {
                  title: 'İşletmenizi siparişe kapatın',
                  bodyText: 'İşletmeniz kapatılacak ve müşterileriniz bu süreçte sipariş veremeyecektir. Bu işlemi onaylıyor musunuz?',
                  buttonClass: 'btn btn-warning'
              }
          };

          const setModal = (checked)=>{
              activityChangeAlertModal.find('.modal-title').text(modalMap[checked].title);
              activityChangeAlertModal.find('.modal-body').text(modalMap[checked].bodyText);
              const button = activityChangeAlertModal.find('button#accept');
              button.text(modalMap[checked].buttonText);
              button[0].className = modalMap[checked].buttonClass;
          }

          input.addEventListener('change', (e)=> {
              const checked = input.checked;
              input.checked = !checked;

              if(requestStorage !== undefined) clearTimeout(requestStorage);

              setModal(checked);
              activityChangeAlertModal.modal('show');

              activityChangeAlertModal.on('click', 'button#accept',()=>{
                  requestStorage = setTimeout(()=> {
                      fetch('/_partner/update/place/activity', {
                          method: 'POST', headers: {'Content-Type' : 'application/json'},
                          body: JSON.stringify({active: checked, place: window.activePlace.pid})
                      }).then(async response=> {
                          const data = await response.json();
                          // fresh
                          lastActivityStatus = data.active || checked;
                          requestStorage = undefined;
                          input.checked = lastActivityStatus;
                          setModal(lastActivityStatus)
                      }).catch(e=>{
                          console.error(e);
                          // re-back
                          input.checked = lastActivityStatus;
                          requestStorage = undefined;
                      });
                  },1000);

                  activityChangeAlertModal.off('click');
                  activityChangeAlertModal.modal('hide');
                  activityChangeAlertModal.hide();
              });
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