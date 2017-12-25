import React from "react";

export default () => (
    <header className="header">
        <div className="container">
            <div className="header__container">
                <h1 className="title__primary">Game of life</h1>
                <div className="header__social">
                    <a
                        href="https://github.com/tiagocorreiaalmeida"
                        target="_blank"
                        className="header__social__link"
                    >
                        <i className="ion-social-github" />
                    </a>
                    <a
                        href="http://www.tiagoalmeidacorreia.pt"
                        target="_blank"
                        className="header__social__link"
                    >
                        <i className="ion-briefcase" />
                    </a>
                    <a
                        href="https://codepen.io/tiagocorreia/"
                        target="_blank"
                        className="header__social__link"
                    >
                        <i className="ion-social-codepen-outline" />
                    </a>
                </div>
            </div>
        </div>
    </header>
);
