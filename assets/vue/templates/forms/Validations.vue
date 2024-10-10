<script setup>


</script>

<template>
    <!--start main wrapper-->
    <main class="main-wrapper">
        <div class="main-content">
            <div class="row">
                <div class="col-xl-6 mx-auto">
                    <div class="card">
                        <div class="card-header px-4 py-3">
                            <h5 class="mb-0">Bootstrap Validation</h5>
                        </div>
                        <div class="card-body p-4">
                            <form class="row g-3 needs-validation" novalidate>
                                <div class="col-md-6">
                                    <label for="bsValidation1" class="form-label">First Name</label>
                                    <input type="text" class="form-control" id="bsValidation1" placeholder="First Name"
                                        value="Jhon" required>
                                    <div class="valid-feedback">
                                        Looks good!
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label for="bsValidation2" class="form-label">Last Name</label>
                                    <input type="text" class="form-control" id="bsValidation2" placeholder="Last Name"
                                        value="Deo" required>
                                    <div class="valid-feedback">
                                        Looks good!
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="bsValidation3" class="form-label">Phone</label>
                                    <input type="text" class="form-control" id="bsValidation3" placeholder="Phone"
                                        required>
                                    <div class="invalid-feedback">
                                        Please choose a username.
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="bsValidation4" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="bsValidation4" placeholder="Email"
                                        required>
                                    <div class="invalid-feedback">
                                        Please provide a valid email.
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="bsValidation5" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="bsValidation5"
                                        placeholder="Password" required>
                                    <div class="invalid-feedback">
                                        Please choose a password.
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="d-flex align-items-center gap-3">
                                        <div class="form-check">
                                            <input type="radio" class="form-check-input" id="bsValidation6"
                                                name="radio-stacked" required>
                                            <label class="form-check-label" for="bsValidation6">Male</label>
                                        </div>
                                        <div class="form-check">
                                            <input type="radio" class="form-check-input" id="bsValidation7"
                                                name="radio-stacked" required>
                                            <label class="form-check-label" for="bsValidation7">Female</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="bsValidation8" class="form-label">DOB</label>
                                    <input type="date" class="form-control" id="bsValidation8" required>
                                    <div class="invalid-feedback">
                                        Please select date.
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="bsValidation9" class="form-label">Country</label>
                                    <select id="bsValidation9" class="form-select" required>
                                        <option selected disabled value>...</option>
                                        <option>One</option>
                                        <option>Two</option>
                                        <option>Three</option>
                                    </select>
                                    <div class="invalid-feedback">
                                        Please select a valid country.
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label for="bsValidation10" class="form-label">City</label>
                                    <input type="text" class="form-control" id="bsValidation10" placeholder="City"
                                        required>
                                    <div class="invalid-feedback">
                                        Please provide a valid city.
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label for="bsValidation11" class="form-label">State</label>
                                    <select id="bsValidation11" class="form-select" required>
                                        <option selected disabled value>Choose...</option>
                                        <option>One</option>
                                        <option>Two</option>
                                        <option>Three</option>
                                    </select>
                                    <div class="invalid-feedback">
                                        Please select a valid State.
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <label for="bsValidation12" class="form-label">Zip</label>
                                    <input type="text" class="form-control" id="bsValidation12" placeholder="Zip"
                                        required>
                                    <div class="invalid-feedback">
                                        Please enter a valid Zip code.
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <label for="bsValidation13" class="form-label">Address</label>
                                    <textarea class="form-control" id="bsValidation13" placeholder="Address ..."
                                        rows="3" required></textarea>
                                    <div class="invalid-feedback">
                                        Please enter a valid address.
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="bsValidation14" required>
                                        <label class="form-check-label" for="bsValidation14">Agree to terms and
                                            conditions</label>
                                        <div class="invalid-feedback">
                                            You must agree before submitting.
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="d-md-flex d-grid align-items-center gap-3">
                                        <button type="submit" class="btn btn-grd-primary px-4">Submit</button>
                                        <button type="reset" class="btn btn-grd-info px-4">Reset</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <!--end row-->
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="card">
                        <div class="card-header px-4 py-3">
                            <h5 class="mb-0">jQuery Validation</h5>
                        </div>
                        <div class="card-body p-4">
                            <form id="jQueryValidationForm">
                                <div class="row mb-3">
                                    <label for="input35" class="col-sm-3 col-form-label">Enter Your Name</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" id="input35" name="yourname"
                                            placeholder="Enter Your Name">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="input36" class="col-sm-3 col-form-label">Phone No</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" id="input36" name="phone"
                                            placeholder="Phone No">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="input37a" class="col-sm-3 col-form-label">Username</label>
                                    <div class="col-sm-9">
                                        <input type="text" class="form-control" id="input37a" name="username"
                                            placeholder="Email Address">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="input37" class="col-sm-3 col-form-label">Email Address</label>
                                    <div class="col-sm-9">
                                        <input type="email" class="form-control" id="input37" name="email"
                                            placeholder="Email Address">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="input38a" class="col-sm-3 col-form-label">Choose Password</label>
                                    <div class="col-sm-9">
                                        <input type="password" class="form-control" id="input38a" name="password"
                                            placeholder="Choose Password">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="input38" class="col-sm-3 col-form-label">Confirm Password</label>
                                    <div class="col-sm-9">
                                        <input type="password" class="form-control" id="input38" name="confirm_password"
                                            placeholder="Confirm Password">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="input39" class="col-sm-3 col-form-label">Select Country</label>
                                    <div class="col-sm-9">
                                        <select class="form-select" id="input39" name="country">
                                            <option selected disabled value>Choose...</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="input40" class="col-sm-3 col-form-label">Address</label>
                                    <div class="col-sm-9">
                                        <textarea class="form-control" id="input40" name="address" rows="3"
                                            placeholder="Address"></textarea>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label class="col-sm-3 col-form-label"></label>
                                    <div class="col-sm-9">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="input41" name="agree">
                                            <label class="form-check-label" for="input41">Check me out</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <label class="col-sm-3 col-form-label"></label>
                                    <div class="col-sm-9">
                                        <div class="d-md-flex d-grid align-items-center gap-3">
                                            <button type="submit" class="btn btn-grd-primary px-4">Submit</button>
                                            <button type="reset" class="btn btn-grd-info px-4">Reset</button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
            <!--end row-->
        </div>
    </main>
    <!--end main wrapper-->
</template>