var resolveAfter2Seconds = function() {
    console.log("Initialisation de la promesse lente");
    messageToDisplay.innerText = "DEBUT  de la promesse lente" ; 
    return new Promise(resolve => {    // ça c'est la fonction qui est retournée une fois tout le code épuisé
      setTimeout(function() {
        resolve("---lente---");   
        console.log("La promesse lente est terminée");
        messageToDisplay.innerText="FIN de la promesse lente" ; 
      }, 5000);
    });
  };
  
  var resolveAfter1Second = function() {
    console.log("Initialisation de la promesse rapide");
    messageToDisplay.innerText="DEBUT  de la promesse rapide" ; 
    return new Promise(resolve =>  {    // ça c'est la fonction qui est retournée une fois tout le code épuisé
      setTimeout(function() {
        resolve("---rapide---"); 
        console.log("La promesse rapide est terminée");
        messageToDisplay.innerText="FIN  de la promesse rapide" ;
      }, 1000);
    });
  };
  
  var sequentialStart = async function() {
    console.log('==Début séquentiel==');
  
    // 1. L'exécution atteint ce point quasi-instantanément
    const lente = await resolveAfter2Seconds();
    console.log(lente); // 2. cela s'exécute 2s après 1.
  
    const rapide = await resolveAfter1Second();
    console.log(rapide); // 3. cela s'exécute 3s après 1.
  }
  
  var concurrentStart = async function() {
    console.log('==Début concurrentiel avec await==');
    const lente = resolveAfter2Seconds(); // le minuteur démarre immédiatement
    const rapide = resolveAfter1Second();  // le minuteur démarre immédiatement
  
    // 1. L'exécution atteint ce point quasi-instantanément
    console.log(await lente); // 2. s'exécute 2s après 1.
    console.log(await rapide); // 3. s'exécute 2s après 1., immédiatement après 2.,
                               // car "rapide" est déjà résolue
  } 
  
  var concurrentPromise = function() {
    console.log('==Début concurrentiel avec Promise.all==');
    return Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then((messages) => {
      console.log(messages[0]); // lente
      console.log(messages[1]); // rapide
    });
  }
  
  var parallel = async function() {
    console.log('==Exécution parallèle avec await Promise.all==');  
    // Démarre 2 tâches en parallèle et on attend que les deux soient finies
    await Promise.all([
        (async()=>console.log(await resolveAfter2Seconds()))(),
        (async()=>console.log(await resolveAfter1Second()))()
    ]);
  }
  
  // Cette fonction ne gère pas les erreurs
  // voir les avertissement ci-après !
  var parallelPromise = function() {
    console.log('==Exécution parallèle avec Promise.then==');
    resolveAfter2Seconds().then((message)=>console.log(message));
    resolveAfter1Second().then((message)=>console.log(message));
  }
  
const boutonStart = document.getElementById('theButton') ; 
const listeDeroulante = document.getElementById('choice')  ;
var messageToDisplay =  document.getElementById('result') ;
var indiceList = 0 ; // par défaut

listeDeroulante.addEventListener("change", (eventList) => {
  
  // Pour afficher le texte:
  indiceList = eventList.target.selectedIndex;
  console.log("choix : " + eventList.target.options[indiceList].innerText ) ;
  
});


boutonStart.addEventListener("click", ()=> {

    switch (indiceList) {
    case 0:      
      sequentialStart();    // après 2 secondes, "lente" est affichée, après une
                            // autre seconde, c'est "rapide" qui est affichée
      break;
    case 1:      
      concurrentStart() ;     // 2s avant d'afficher "lente" puis "rapide"  
      break;
    case 2:      
      concurrentPromise() ;   // identique à concurrentStart
    break;
    case 3:
      parallel() ;            // réellement parallele : après 1 seconde, affiche "rapide" et après une autre seconde affiche "lente"
    break;
    case 4:
      parallelPromise() ;     // identique à parallel
    break ;  
  }

  //sequentialStart();    // après 2 secondes, "lente" est affichée, après une
  //                          // autre seconde, c'est "rapide" qui est affichée
  // on attend que l'étape précédente soit terminée
  //setTimeout(concurrentStart, 4000); // 2s avant d'afficher "lente" puis "rapide"
  
  // on attend à nouveau
  //setTimeout(concurrentPromise, 7000); // identique à concurrentStart
  
  // on attend à nouveau
  //setTimeout(parallel, 10000); // réellement parallele : après 1 seconde,
                               // affiche "rapide" et après une autre seconde
                               // affiche "lente"
  
  // on attend à nouveau
  //setTimeout(parallelPromise, 13000); // identique à parallel
}) ; 