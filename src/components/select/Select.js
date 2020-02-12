import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "./Select.css";
import Input from "../input/Input";
import AppIcon from "../icons/Icon";
import ms from "microseconds";
import {
  addClass,
  hasClass,
  randomIDGenerator,
  removeClass
} from "../../utils/helper";

export const Select = props => {
  const [optionList, setOptionList] = useState([]);
  const [defaultOptionList, setDefaultOptionList] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selection, setSelection] = useState("");
  const [name, setName] = useState("");
  const [activeOption, setActiveOption] = useState("");
  const [activeID] = useState(`${randomIDGenerator(6)}-${ms.now()}`);
  const [selectId] = useState(`${randomIDGenerator(6)}-${ms.now()}`);

  useEffect(() => {
    setOptionList(props.optionList);
    setDefaultOptionList(props.optionList);
    setName(props.name);
    if (props.defaultOption && props.defaultOption.title) {
      setSelection(props.defaultOption.title);
    }
  }, [props]);

  useEffect(() => {
    if (selection !== "") {
      handleSelection();
    }
  }, [selection]);

  useEffect(() => {
    createSetupOption();
    document.getElementById("mainBar").addEventListener("scroll", () => {
      positionOptionDrop();
    });
    handleClicks();
  }, []);

  useEffect(() => {
    const selectDrop = document.getElementById(activeID);
    const ul = selectDrop.getElementsByTagName("ul")[0];
    if (!ul) {
      return;
    }
    ul.innerHTML = "";
    appendSelections(ul, optionList);
    positionOptionDrop();
  }, [optionList]);

  const createSetupOption = () => {
    let el = document.createElement("div");
    el.id = activeID;
    el.classList.add("select-root");
    document.body.appendChild(el);
    addOptions(el);
  };

  const addOptions = el => {
    let ul = document.createElement("ul");
    ul.classList.add("select-ul");
    appendSelections(ul, defaultOptionList);
    el.appendChild(ul);
  };

  const appendSelections = (ul, _list) => {
    _list.map((item, index) => {
      let li = document.createElement("li");
      li.classList.add("select-li");
      li.innerHTML = item.title;
      li.onclick = e => {
        setSelection(e.target.innerHTML);
      };
      ul.appendChild(li);
      return null;
    });
  };

  const positionOptionDrop = _ => {
    let el = document.getElementById(activeID.toString());
    let inputField = document.getElementById(selectId.toString());
    const inputBounds = inputField.getBoundingClientRect();
    el.style.left = `${inputBounds.x}px`;
    el.style.width = `${inputBounds.width}px`;
    const dropBounds = el.getBoundingClientRect();
    const mainDocBounds = document
      .getElementById("mainBar")
      .getBoundingClientRect();
    if (dropBounds.top + dropBounds.height > mainDocBounds.height - 50) {
      el.style.top = `${inputBounds.y -
        dropBounds.height -
        inputBounds.height / 2 +
        10}px`;
    } else {
      el.style.top = `${inputBounds.y + inputBounds.height / 2 + 25}px`;
    }
  };

  const handleSelection = _ => {
    const valueCheck = defaultOptionList.filter(
      item => item.title === selection
    );
    if (valueCheck.length > 0) {
      setSelectedOption(valueCheck[0]);
      setActiveOption(valueCheck[0].title);
      if (props.onChange) {
        props.onChange({
          target: {
            name,
            value: valueCheck[0].value
          }
        });
      }
      closeAllSelect();
    }
  };

  const handleClicks = () => {
    const input = document.getElementById(selectId);
    document.body.onclick = e => {
      if (
        hasClass(e.target, "select-li") ||
        hasClass(e.target, "select-input")
      ) {
        return;
      }
      closeAllSelect();
    };
    input.onclick = () => {
      const selectDrop = document.getElementById(activeID);

      if (!hasClass(selectDrop, "open")) {
        closeAllSelect(activeID);
        addClass(selectDrop, "open");
      } else {
        removeClass(selectDrop, "open");
      }
    };
  };

  const closeAllSelect = id => {
    const allSelect = document.getElementsByClassName("select-root");
    if (allSelect) {
      for (let i = 0; i < allSelect.length; i++) {
        if (hasClass(allSelect[i], "open")) {
          if (id && allSelect[id] !== id) {
            removeClass(allSelect[i], "open");
          } else {
            removeClass(allSelect[i], "open");
          }
        }
      }
    }
  };

  const onChange = e => {
    setActiveOption(e.target.value);
    setSelectedOption(null);
    const newList = defaultOptionList.filter(item =>
      item.title.toString().includes(e.target.value.toLowerCase())
    );
    if (e.target.value.length > 0) {
      setOptionList(newList);
    } else {
      setOptionList(defaultOptionList);
    }
  };

  return (
    <Input
      id={selectId}
      type="text"
      className="select-input"
      value={activeOption}
      onBlur={_ => {
        if (!selectedOption) {
          setActiveOption("");
          setOptionList(defaultOptionList);
        }
      }}
      onChange={onChange}
      placeholder={props.placeholder}
      iconRight={<AppIcon name="ic_arrow_drop_down" type="md" />}
    />
  );
};
