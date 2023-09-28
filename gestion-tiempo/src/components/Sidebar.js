import React, { useState, useEffect } from "react";
import "../App.css";
import Nav from 'react-bootstrap/Nav';

function Sidebar(){
    return (
        <Nav defaultActiveKey="/home" className="flex-column">
          <Nav.Link href="/home">Active</Nav.Link>
          <Nav.Link eventKey="link-1">Link</Nav.Link>
          <Nav.Link eventKey="link-2">Link</Nav.Link>
          <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav>
      );

}

export default Sidebar;

