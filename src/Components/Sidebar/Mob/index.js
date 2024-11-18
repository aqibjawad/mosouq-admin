import React, { useState } from "react";

import { slide as Menu } from "react-burger-menu";

import { Link } from "react-router-dom";

import { BsChevronCompactDown } from 'react-icons/bs';

import './index.scss'

const MobSide = () => {

    const [active, setActive] = useState(1);

    const [activebutton, setActiveButton] = useState();

    const [activebutton2, setActiveButton2] = useState();

    const [open, setOpen] = useState()


    return (
        <div className='right-sidebar'>
            <Menu right className="menu-item" isOpen={open}>

                <ul className="" style={{marginLeft:'-2rem'}}> 
                    <li className="">
                        <Link to="/" className="menu-item" >
                            <span className='d-flex'>
                                <p style={{ textDecoration: 'none' }}> Dashboard </p>
                            </span>
                        </Link>
                    </li>

                    {/* Category Start */}

                    <li className="pt-3">
                        <div className="d-flex justify-content-between menu-item" onClick={() => setActiveButton(!activebutton)}>
                            <div>
                                <button className="btn" style={{color:'white'}}>
                                    Listing
                                </button>
                            </div>
                            <div>
                                <BsChevronCompactDown />
                            </div>
                        </div>

                        {activebutton ? (
                            <div className="sub-menu-item">
                                <div className="">
                                    <Link to="/main_product">
                                        <span>
                                            <p> Main Product </p>
                                        </span>
                                    </Link>
                                </div>

                                <div className="">
                                    <Link to="/product">
                                        <span>
                                            <p> Product </p>
                                        </span>

                                    </Link>
                                </div>

                                <div className="">
                                    <Link to="/product_details">
                                        <span>
                                            <p> Product Details </p>
                                        </span>
                                    </Link>
                                </div>

                                <div className="">
                                    <Link to="/features">
                                        <span>
                                            <p> Features </p>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </li>

                    {/* Category End */}

                    {/* Crousal Starts */}

                    <li className="pt-3">
                        <Link to="/crousal_one" className="menu-item" >
                            <span className='d-flex'>
                                <p style={{ textDecoration: 'none' }}> Crousal One </p>
                            </span>
                        </Link>
                    </li>

                    <li className="pt-3">
                        <Link to="/crousal_second" className="menu-item" >
                            <span className='d-flex'>
                                <p style={{ textDecoration: 'none' }}> Crousal Two </p>
                            </span>
                        </Link>
                    </li>

                    {/* Crousal End */}

                    {/* Users Start */}
                    <li className="pt-3">
                        <Link to="/users" className="menu-item" >
                            <span className='d-flex'>
                                <p style={{ textDecoration: 'none' }}> Users </p>
                            </span>
                        </Link>
                    </li>
                    {/* Users End */}

                    <li className="pt-3">
                        <div className="d-flex justify-content-between menu-item" onClick={() => setActiveButton2(!activebutton2)}>
                            <div>
                                <button className="btn" style={{color:'white'}}>
                                    Careers
                                </button>
                            </div>
                            <div>
                                <BsChevronCompactDown />
                            </div>
                        </div>
                        {activebutton2 ? (
                            <div className="">
                                <div className="sub-menu-item">
                                    <Link to="/career">
                                        <span>
                                            <p> Jobs </p>
                                        </span>

                                    </Link>
                                </div>

                                <div className="sub-menu-item">
                                    <Link to="/request">
                                        <span>
                                            <p> Request </p>
                                        </span>

                                    </Link>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </li>

                    <li className="pt-3">
                        <Link to="/coupon" className="menu-item" >
                            <span className='d-flex'>
                                <p style={{ textDecoration: 'none' }}> Coupon </p>
                            </span>
                        </Link>
                    </li>

                </ul>
            </Menu>
        </div>
    )
}

export default MobSide