// const functions = require('firebase-functions');
// var request = require('request');
// var rp = require('request-promise');


// var url = 'https://lhb.luminuxlab.com/api/post/';


// const admin = require('firebase-admin');
// admin.initializeApp();

// const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

// exports.firestoreSync = functions.firestore
// .document('projects/{projectId}/submission/details')
// .onCreate((snap, context) => {

//     // const projectId = context.params.projectId

//     // const newValue = snap.data();
//     // const db = admin.firestore();


//     var options = {
//         method: 'POST',
//         uri: 'https://lhb.luminuxlab.com/api/post/',
//         //resolveWithFullResponse: true,
//         body: {
//             some: 'payload'
//         },
//         json: true // Automatically stringifies the body to JSON
//     };


//     return rp(options)
//     .then(function (response) {
//         console.log("response", response)
//         return response
//     })
//     .catch(function (err) {
//         console.log("error", err)
//         // POST failed...
//     });


//     // let items = db.collection('projects/' + projectId + '/items')
//     // .get()
//     // .then(snapshot => {
//     //     let itemsArray = snapshot.docs.map(doc => {
//     //        return doc.id;
//     //     }); 
//     //    return itemsArray    
//     // }).catch(function(error){
//     //     console.log("got an error",error);        
//     // })

//     // return itemsArray
//     // .then(
//     //    console.log(arrayR)
     
//     // ).catch(function(error){
//     //     console.log("got an error",error);        
//     // })


// }) 