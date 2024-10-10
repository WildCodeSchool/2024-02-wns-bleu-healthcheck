import "./Premium.scss";
import Button from "@mui/material/Button";

const Premium = () => {

    const premiumOptionTitle = "Premium"

    const handleSubscribe = () => {
        console.log("Subscribe")
    }

    return (
        <div className="premium__wrapper">
            <h1>Pourquoi devenir membre Premium ?</h1>
            <div className="premium__options_wrapper">
                <div className="premium__option_square">
                    <div className="premium__options_title">
                        Gratuit
                    </div>
                    <div className="premium__price">
                        0€/mois
                    </div>
                    <div className="premium__features">
                        <span>&#10003; Accès au dashboard</span>
                        <span>&#10003; Historique des requêtes</span>
                        <span>&#10003; Jusqu'à 3 requêtes enregistrées</span>
                        <span>&#10003; Fréquence de 60 minutes</span>
                    </div>
                </div>
                <div className="premium__option_square">
                    <div className="premium__options_title premium__glow">
                        {premiumOptionTitle.split("").map((char, index) => (
                            <span key={index}>{char}</span>
                        ))}
                    </div>
                    <div className="premium__price">
                        10€/mois
                    </div>
                    <div className="premium__features">
                        <span>&#10003; Accès au dashboard</span>
                        <span>&#10003; Historique des requêtes</span>
                        <span><span className="premium__features_green">&#10003;</span> Jusqu'à 100 requêtes enregistrées</span>
                        <span><span className="premium__features_green">&#10003;</span> Fréquence réglable (1-60 minutes)</span>
                        <span><span className="premium__features_green">&#10003;</span> Alertes par mail</span>
                        <span><span className="premium__features_green">&#10003;</span> Statistiques avancées</span>
                    </div>
                    <div className="premium__subscribe-button">
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleSubscribe()}
                        >
                            S'abonner
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Premium;
