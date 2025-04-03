async function updateLocation(locationData) {
    const { locationUuid, latitude, longitude, zoom } = locationData;
    const payload = { latitude, longitude, zoom };

    const existingLocation = window.transporter.place.location || {};

    const hasChanged = existingLocation.latitude !== latitude ||
        existingLocation.longitude !== longitude ||
        existingLocation.zoom !== zoom;

    if (!hasChanged) {
        return;
    }

    if (locationUuid && locationUuid !== '0') {
        try {
            await $.ajax({
                url: `/_route/api/api/place/locations/${locationUuid}`,
                type: 'PATCH',
                contentType: 'application/merge-patch+json',
                data: JSON.stringify(payload),
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            });
            window.transporter.place.location.latitude = latitude;
            window.transporter.place.location.longitude = longitude;
            window.transporter.place.location.zoom = zoom;
        } catch (error) {
            console.error('Lokasyon güncelleme hatası:', error);
            toastr.error('Lokasyon güncellenirken bir hata oluştu.');
        }
    } else {
        try {
            payload.place = `/api/places/${placeId}`;
            window.transporter.place.location = await $.ajax({
                url: `/_route/api/api/place/locations`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                error:(e)=>console.error(e),
                success: (s)=> console.log(s),
                failure: (f) => console.log(f)
            });
        } catch (error) {
            console.error('Lokasyon oluşturma hatası:', error);
            toastr.error('Lokasyon oluşturulurken bir hata oluştu.');
        }
    }
}
