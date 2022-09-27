$.map(item.avatar, function(mapAvatar, indexAvatar) {
    var fileuploaded = mapAvatar.filename;
    var missingFile = 'Falta Archivo';
    return (typeof mapAvatar !== 'undefined' && typeof mapAvatar.filename !== 'undefined') ?
        fileuploaded
    :
        $.map(mapAvatar, function(mapAvatarSub, indexAvatarSub) {
            fileuploaded = mapAvatarSub.filename + '2';
            return (typeof mapAvatarSub !== 'undefined' && typeof mapAvatarSub.filename !== 'undefined') ?
                fileuploaded
            :
                missingFile
        })
})
