import React, { useState } from "react";
import TeamTemplate from "./components/TeamTemplate";
import preRegister from "../../assets/preRegister.svg";
import Register from "../../assets/Register.svg";
import { Button } from "../../components/button/Button";
import Input from "../../components/input/Input";
import "./team.css";
import { axiosHandler } from "../../utils/axiosHandler";
import { TEAMS_URL } from "../../utils/urls";
import { Notification } from "../../components/notification/Notification";
import { useHistory } from "react-router-dom";

export const testToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTgzMDU0NzQ3LCJqdGkiOiI3NjgzYWQwMjE3NjM0MTU0YjQ5OWQ5NzA2MGJhMTYwYyIsInVzZXJfaWQiOjQzfQ.V0ZgY-XTWIXqIbAOMNqKwFHOpxhTdBz1JLKPWtEqXZI";

const TeamCreatePage = props => {
  let history = useHistory();
  const [teamName, setTeamName] = useState("");
  const [getStartedPage, setGetStartedPage] = useState(true);

  const onFormSubmit = e => {
    e.preventDefault();
    axiosHandler("POST", TEAMS_URL, testToken, { name: teamName })
      .then(() => {
        setTeamName(teamName);
        history.push({
          pathname: "/team/members",
          state: { teamName: teamName }
        });
      })
      .catch(err => {
        console.log(err);
        Notification.bubble({
          type: "error",
          content: "Unable to create team"
        });
      });
    console.log(teamName);
    setTeamName("");
  };

  let content = getStartedPage ? (
    <Button onClick={() => setGetStartedPage(false)} className="button">
      Get Started
    </Button>
  ) : (
    <>
      <div className="team-input-div">
        {" "}
        <p className="team-input-text">Give your team a name</p>
        <Input
          type="text"
          className="team-input"
          onChange={e => {
            setTeamName(e.target.value);
          }}
          value={teamName}
          placeholder="Team Name (e.g. The Elites)"
          required
        />
        <br />
        <br />
        <div className="flex">
          <Button type="submit" className="team-button">
            Create Team
          </Button>
          <a className="cancel" onClick={() => setGetStartedPage(true)}>
            Cancel
          </a>
        </div>
      </div>
    </>
  );

  return (
    <TeamTemplate
      content={content}
      undraw={getStartedPage ? preRegister : Register}
      onFormSubmit={onFormSubmit}
      teamName={teamName}
    />
  );
};

export default TeamCreatePage;
