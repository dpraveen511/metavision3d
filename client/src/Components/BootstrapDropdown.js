import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function BootstrapDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Select an option");

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
        {selectedItem}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => setSelectedItem("Action")}>Action</DropdownItem>
        <DropdownItem onClick={() => setSelectedItem("Another action")}>Another action</DropdownItem>
        <DropdownItem onClick={() => setSelectedItem("Something else here")}>Something else here</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default BootstrapDropdown;
