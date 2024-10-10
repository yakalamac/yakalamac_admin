<script setup>
import $ from '../../../bootstrap/assets/js/jquery.min';

// $(document).ready(function () {
//     new PerfectScrollbar('.chat-list');
//     new PerfectScrollbar('.chat-content');
// });
</script>

<template>
    <!--start main wrapper-->
    <main class="main-wrapper">
        <div class="main-content">
            <div class="chat-wrapper">
                <div class="chat-sidebar">
                    <div class="chat-sidebar-header">
                        <div class="d-flex align-items-center">
                            <div class="chat-user-online">
                                <img src="../../../../assets/bootstrap/assets/images/avatars/01.png" width="45" height="45" class="rounded-circle"
                                    alt="" />
                            </div>
                            <div class="flex-grow-1 ms-2">
                                <p class="mb-0">Rachel Zane</p>
                            </div>
                            <div class="dropdown">
                                <div class="cursor-pointer font-24 dropdown-toggle dropdown-toggle-nocaret"
                                    data-bs-toggle="dropdown"><i class='bx bx-dots-horizontal-rounded'></i>
                                </div>
                                <div class="dropdown-menu dropdown-menu-end"> <a class="dropdown-item"
                                        href="javascript:;">Settings</a>
                                    <div class="dropdown-divider"></div> <a class="dropdown-item"
                                        href="javascript:;">Help & Feedback</a>
                                    <a class="dropdown-item" href="javascript:;">Enable Split View Mode</a>
                                    <a class="dropdown-item" href="javascript:;">Keyboard Shortcuts</a>
                                    <div class="dropdown-divider"></div> <a class="dropdown-item"
                                        href="javascript:;">Sign Out</a>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3"></div>
                        <div class="input-group input-group-sm"> <span class="input-group-text bg-transparent"><i
                                    class='bx bx-search'></i></span>
                            <input type="text" class="form-control" placeholder="People, groups, & messages"> <span
                                class="input-group-text bg-transparent"><i class='bx bx-dialpad'></i></span>
                        </div>
                        <div class="chat-tab-menu mt-3">
                            <ul class="nav nav-pills nav-justified">
                                <li class="nav-item">
                                    <a class="nav-link active" data-bs-toggle="pill" href="javascript:;">
                                        <div class="font-24"><i class='bx bx-conversation'></i>
                                        </div>
                                        <div><small>Chats</small>
                                        </div>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="pill" href="javascript:;">
                                        <div class="font-24"><i class='bx bx-phone'></i>
                                        </div>
                                        <div><small>Calls</small>
                                        </div>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="pill" href="javascript:;">
                                        <div class="font-24"><i class='bx bxs-contact'></i>
                                        </div>
                                        <div><small>Contacts</small>
                                        </div>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="pill" href="javascript:;">
                                        <div class="font-24"><i class='bx bx-bell'></i>
                                        </div>
                                        <div><small>Notifications</small>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="chat-sidebar-content">
                        <div class="tab-content" id="pills-tabContent">
                            <div class="tab-pane fade show active" id="pills-Chats">
                                <div class="p-3">
                                    <div class="meeting-button d-flex justify-content-between">
                                        <div class="dropdown"> <a href="#"
                                                class="btn btn-white btn-sm radius-30 dropdown-toggle dropdown-toggle-nocaret"
                                                data-bs-toggle="dropdown"><i class='bx bx-video me-2'></i>Meet Now<i
                                                    class='bx bxs-chevron-down ms-2'></i></a>
                                            <div class="dropdown-menu"> <a class="dropdown-item" href="#">Host a
                                                    meeting</a>
                                                <a class="dropdown-item" href="#">Join a meeting</a>
                                            </div>
                                        </div>
                                        <div class="dropdown"> <a href="#"
                                                class="btn btn-white btn-sm radius-30 dropdown-toggle dropdown-toggle-nocaret"
                                                data-bs-toggle="dropdown" data-display="static"><i
                                                    class='bx bxs-edit me-2'></i>New Chat<i
                                                    class='bx bxs-chevron-down ms-2'></i></a>
                                            <div class="dropdown-menu dropdown-menu-right"> <a class="dropdown-item"
                                                    href="#">New Group Chat</a>
                                                <a class="dropdown-item" href="#">New Moderated Group</a>
                                                <a class="dropdown-item" href="#">New Chat</a>
                                                <a class="dropdown-item" href="#">New Private Conversation</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dropdown mt-3"> <a href="#"
                                            class="text-uppercase text-secondary dropdown-toggle dropdown-toggle-nocaret"
                                            data-bs-toggle="dropdown">Recent Chats <i
                                                class='bx bxs-chevron-down'></i></a>
                                        <div class="dropdown-menu"> <a class="dropdown-item" href="#">Recent Chats</a>
                                            <a class="dropdown-item" href="#">Hidden Chats</a>
                                            <div class="dropdown-divider"></div> <a class="dropdown-item" href="#">Sort
                                                by Time</a>
                                            <a class="dropdown-item" href="#">Sort by Unread</a>
                                            <div class="dropdown-divider"></div> <a class="dropdown-item" href="#">Show
                                                Favorites</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="chat-list">
                                    <div class="list-group list-group-flush">
                                        <a href="javascript:;" class="list-group-item">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/02.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Louis Litt</h6>
                                                    <p class="mb-0 chat-msg">You just got LITT up, Mike.</p>
                                                </div>
                                                <div class="chat-time">9:51 AM</div>
                                            </div>
                                        </a>
                                        <a href="javascript:;" class="list-group-item active">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Harvey Specter</h6>
                                                    <p class="mb-0 chat-msg">Wrong. You take the gun....</p>
                                                </div>
                                                <div class="chat-time">4:32 PM</div>
                                            </div>
                                        </a>
                                        <a href="javascript:;" class="list-group-item">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/04.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Rachel Zane</h6>
                                                    <p class="mb-0 chat-msg">I was thinking that we could...</p>
                                                </div>
                                                <div class="chat-time">Wed</div>
                                            </div>
                                        </a>
                                        <a href="javascript:;" class="list-group-item">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/05.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Donna Paulsen</h6>
                                                    <p class="mb-0 chat-msg">Mike, I know everything!</p>
                                                </div>
                                                <div class="chat-time">Tue</div>
                                            </div>
                                        </a>
                                        <a href="javascript:;" class="list-group-item">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/06.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Jessica Pearson</h6>
                                                    <p class="mb-0 chat-msg">Have you finished the draft...</p>
                                                </div>
                                                <div class="chat-time">9/3/2020</div>
                                            </div>
                                        </a>
                                        <a href="javascript:;" class="list-group-item">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/07.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Harold Gunderson</h6>
                                                    <p class="mb-0 chat-msg">Thanks Mike! :)</p>
                                                </div>
                                                <div class="chat-time">12/3/2020</div>
                                            </div>
                                        </a>
                                        <a href="javascript:;" class="list-group-item">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/09.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Katrina Bennett</h6>
                                                    <p class="mb-0 chat-msg">I've sent you the files for...</p>
                                                </div>
                                                <div class="chat-time">16/3/2020</div>
                                            </div>
                                        </a>
                                        <a href="javascript:;" class="list-group-item">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/10.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Charles Forstman</h6>
                                                    <p class="mb-0 chat-msg">Mike, this isn't over.</p>
                                                </div>
                                                <div class="chat-time">18/3/2020</div>
                                            </div>
                                        </a>
                                        <a href="javascript:;" class="list-group-item">
                                            <div class="d-flex">
                                                <div class="chat-user-online">
                                                    <img src="../../../../assets/bootstrap/assets/images/avatars/11.png" width="42" height="42"
                                                        class="rounded-circle" alt="" />
                                                </div>
                                                <div class="flex-grow-1 ms-2">
                                                    <h6 class="mb-0 chat-title">Jonathan Sidwell</h6>
                                                    <p class="mb-0 chat-msg">That's bullshit. This deal..</p>
                                                </div>
                                                <div class="chat-time">24/3/2020</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-header d-flex align-items-center">
                    <div class="chat-toggle-btn"><i class='bx bx-menu-alt-left'></i>
                    </div>
                    <div>
                        <h4 class="mb-1 font-weight-bold">Harvey Inspector</h4>
                        <div class="list-inline d-sm-flex mb-0 d-none"> <a href="javascript:;"
                                class="list-inline-item d-flex align-items-center text-secondary"><small
                                    class='bx bxs-circle me-1 chart-online'></small>Active Now</a>
                            <a href="javascript:;"
                                class="list-inline-item d-flex align-items-center text-secondary">|</a>
                            <a href="javascript:;" class="list-inline-item d-flex align-items-center text-secondary"><i
                                    class='bx bx-images me-1'></i>Gallery</a>
                            <a href="javascript:;"
                                class="list-inline-item d-flex align-items-center text-secondary">|</a>
                            <a href="javascript:;" class="list-inline-item d-flex align-items-center text-secondary"><i
                                    class='bx bx-search me-1'></i>Find</a>
                        </div>
                    </div>
                    <div class="chat-top-header-menu ms-auto"> <a href="javascript:;"><i class='bx bx-video'></i></a>
                        <a href="javascript:;"><i class='bx bx-phone'></i></a>
                        <a href="javascript:;"><i class='bx bx-user-plus'></i></a>
                    </div>
                </div>
                <div class="chat-content">
                    <div class="chat-content-leftside">
                        <div class="d-flex">
                            <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" width="48" height="48" class="rounded-circle"
                                alt="" />
                            <div class="flex-grow-1 ms-2">
                                <p class="mb-0 chat-time">Harvey, 2:35 PM</p>
                                <p class="chat-left-msg">Hi, harvey where are you now a days?</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-rightside">
                        <div class="d-flex ms-auto">
                            <div class="flex-grow-1 me-2">
                                <p class="mb-0 chat-time text-end">you, 2:37 PM</p>
                                <p class="chat-right-msg">I am in USA</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-leftside">
                        <div class="d-flex">
                            <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" width="48" height="48" class="rounded-circle"
                                alt="" />
                            <div class="flex-grow-1 ms-2">
                                <p class="mb-0 chat-time">Harvey, 2:48 PM</p>
                                <p class="chat-left-msg">okk, what about admin template?</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-rightside">
                        <div class="d-flex">
                            <div class="flex-grow-1 me-2">
                                <p class="mb-0 chat-time text-end">you, 2:49 PM</p>
                                <p class="chat-right-msg">i have already purchased the admin template</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-leftside">
                        <div class="d-flex">
                            <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" width="48" height="48" class="rounded-circle"
                                alt="" />
                            <div class="flex-grow-1 ms-2">
                                <p class="mb-0 chat-time">Harvey, 3:12 PM</p>
                                <p class="chat-left-msg">ohhk, great, which admin template you have purchased?</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-rightside">
                        <div class="d-flex">
                            <div class="flex-grow-1 me-2">
                                <p class="mb-0 chat-time text-end">you, 3:14 PM</p>
                                <p class="chat-right-msg">i purchased dashtreme admin template from themeforest. it is
                                    very good product for web application</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-leftside">
                        <div class="d-flex">
                            <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" width="48" height="48" class="rounded-circle"
                                alt="" />
                            <div class="flex-grow-1 ms-2">
                                <p class="mb-0 chat-time">Harvey, 3:16 PM</p>
                                <p class="chat-left-msg">who is the author of this template?</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-rightside">
                        <div class="d-flex">
                            <div class="flex-grow-1 me-2">
                                <p class="mb-0 chat-time text-end">you, 3:22 PM</p>
                                <p class="chat-right-msg">codervent is the author of this admin template</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-leftside">
                        <div class="d-flex">
                            <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" width="48" height="48" class="rounded-circle"
                                alt="" />
                            <div class="flex-grow-1 ms-2">
                                <p class="mb-0 chat-time">Harvey, 3:16 PM</p>
                                <p class="chat-left-msg">ohh i know about this author. he has good admin products in his
                                    portfolio.</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-rightside">
                        <div class="d-flex">
                            <div class="flex-grow-1 me-2">
                                <p class="mb-0 chat-time text-end">you, 3:30 PM</p>
                                <p class="chat-right-msg">yes, codervent has multiple admin templates. also he is very
                                    supportive.</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-leftside">
                        <div class="d-flex">
                            <img src="../../../../assets/bootstrap/assets/images/avatars/03.png" width="48" height="48" class="rounded-circle"
                                alt="" />
                            <div class="flex-grow-1 ms-2">
                                <p class="mb-0 chat-time">Harvey, 3:33 PM</p>
                                <p class="chat-left-msg">All the best for your target. thanks for giving your time.</p>
                            </div>
                        </div>
                    </div>
                    <div class="chat-content-rightside">
                        <div class="d-flex">
                            <div class="flex-grow-1 me-2">
                                <p class="mb-0 chat-time text-end">you, 3:35 PM</p>
                                <p class="chat-right-msg">thanks Harvey</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-footer d-flex align-items-center">
                    <div class="flex-grow-1 pe-2">
                        <div class="input-group"><span class="input-group-text"><i class='bx bx-smile'></i></span>
                            <input type="text" class="form-control" placeholder="Type a message">
                        </div>
                    </div>
                    <div class="chat-footer-menu">
                        <a href="javascript:;"><i class='bx bx-file'></i></a>
                        <a href="javascript:;"><i class='bx bxs-contact'></i></a>
                        <a href="javascript:;"><i class='bx bx-microphone'></i></a>
                        <a href="javascript:;"><i class='bx bx-dots-horizontal-rounded'></i></a>
                    </div>
                </div>
                <!--start chat overlay-->
                <div class="overlay chat-toggle-btn-mobile"></div>
                <!--end chat overlay-->
            </div>

        </div>
    </main>
    <!--end main wrapper-->

    <!--start overlay-->
    <div class="overlay btn-toggle"></div>
    <!--end overlay-->

    <!--start cart-->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCart">
        <div class="offcanvas-header border-bottom h-70">
            <h5 class="mb-0" id="offcanvasRightLabel">8 New Orders</h5>
            <a href="javascript:;" class="primaery-menu-close" data-bs-dismiss="offcanvas">
                <i class="material-icons-outlined">close</i>
            </a>
        </div>
        <div class="offcanvas-body p-0">
            <div class="order-list">
                <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
                    <div class="order-img">
                        <img src="../../../../assets/bootstrap/assets/images/orders/01.png" class="img-fluid rounded-3" width="75" alt="">
                    </div>
                    <div class="order-info flex-grow-1">
                        <h5 class="mb-1 order-title">White Men Shoes</h5>
                        <p class="mb-0 order-price">$289</p>
                    </div>
                    <div class="d-flex">
                        <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
                        <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
                    </div>
                </div>

                <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
                    <div class="order-img">
                        <img src="../../../../assets/bootstrap/assets/images/orders/02.png" class="img-fluid rounded-3" width="75" alt="">
                    </div>
                    <div class="order-info flex-grow-1">
                        <h5 class="mb-1 order-title">Red Airpods</h5>
                        <p class="mb-0 order-price">$149</p>
                    </div>
                    <div class="d-flex">
                        <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
                        <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
                    </div>
                </div>

                <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
                    <div class="order-img">
                        <img src="../../../../assets/bootstrap/assets/images/orders/03.png" class="img-fluid rounded-3" width="75" alt="">
                    </div>
                    <div class="order-info flex-grow-1">
                        <h5 class="mb-1 order-title">Men Polo Tshirt</h5>
                        <p class="mb-0 order-price">$139</p>
                    </div>
                    <div class="d-flex">
                        <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
                        <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
                    </div>
                </div>

                <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
                    <div class="order-img">
                        <img src="../../../../assets/bootstrap/assets/images/orders/04.png" class="img-fluid rounded-3" width="75" alt="">
                    </div>
                    <div class="order-info flex-grow-1">
                        <h5 class="mb-1 order-title">Blue Jeans Casual</h5>
                        <p class="mb-0 order-price">$485</p>
                    </div>
                    <div class="d-flex">
                        <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
                        <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
                    </div>
                </div>

                <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
                    <div class="order-img">
                        <img src="../../../../assets/bootstrap/assets/images/orders/05.png" class="img-fluid rounded-3" width="75" alt="">
                    </div>
                    <div class="order-info flex-grow-1">
                        <h5 class="mb-1 order-title">Fancy Shirts</h5>
                        <p class="mb-0 order-price">$758</p>
                    </div>
                    <div class="d-flex">
                        <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
                        <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
                    </div>
                </div>

                <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
                    <div class="order-img">
                        <img src="../../../../assets/bootstrap/assets/images/orders/06.png" class="img-fluid rounded-3" width="75" alt="">
                    </div>
                    <div class="order-info flex-grow-1">
                        <h5 class="mb-1 order-title">Home Sofa Set </h5>
                        <p class="mb-0 order-price">$546</p>
                    </div>
                    <div class="d-flex">
                        <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
                        <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
                    </div>
                </div>

                <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
                    <div class="order-img">
                        <img src="../../../../assets/bootstrap/assets/images/orders/07.png" class="img-fluid rounded-3" width="75" alt="">
                    </div>
                    <div class="order-info flex-grow-1">
                        <h5 class="mb-1 order-title">Black iPhone</h5>
                        <p class="mb-0 order-price">$1049</p>
                    </div>
                    <div class="d-flex">
                        <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
                        <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
                    </div>
                </div>

                <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
                    <div class="order-img">
                        <img src="../../../../assets/bootstrap/assets/images/orders/08.png" class="img-fluid rounded-3" width="75" alt="">
                    </div>
                    <div class="order-info flex-grow-1">
                        <h5 class="mb-1 order-title">Goldan Watch</h5>
                        <p class="mb-0 order-price">$689</p>
                    </div>
                    <div class="d-flex">
                        <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
                        <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="offcanvas-footer h-70 p-3 border-top">
            <div class="d-grid">
                <button type="button" class="btn btn-grd btn-grd-primary" data-bs-dismiss="offcanvas">View
                    Products</button>
            </div>
        </div>
    </div>
    <!--end cart-->
</template>

<style scoped></style>