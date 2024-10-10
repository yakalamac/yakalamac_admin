<script setup>

</script>

<template>
      <!--start main wrapper-->
  <main class="main-wrapper">
    <div class="main-content">
        <div class="row">
					<div class="col-xl-12 mx-auto">

						<h6 class="mb-0 text-uppercase">Single Select Examples</h6>
						 <hr>
						<div class="card">
							<div class="card-body">

								<div class="mb-4">
									<label for="single-select-field" class="form-label">Basic single select</label>
									<select class="form-select" id="single-select-field" data-placeholder="Choose one thing">
										
										<option>Reactive</option>
										<option>Solution</option>
										<option>Conglomeration</option>
										<option>Algoritm</option>
										<option>Holistic</option>
									</select>
								</div>
		
								<div class="mb-4">
									<label for="single-select-optgroup-field" class="form-label">Single select w/ optgroup</label>
									<select class="form-select" id="single-select-optgroup-field" data-placeholder="Choose one thing">
										
										<optgroup label="Group 1">
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
										</optgroup>
										<optgroup label="Group 2">
											<option>Algoritm</option>
											<option>Holistic</option>
										</optgroup>
									</select>
								</div>
		
								<div class="mb-4">
									<label for="single-select-clear-field" class="form-label">Single select w/ allow clear</label>
									 <select class="form-select" id="single-select-clear-field" data-placeholder="Choose one thing">
										 
										 <option>Reactive</option>
										 <option>Solution</option>
										 <option>Conglomeration</option>
										 <option>Algoritm</option>
										 <option>Holistic</option>
									 </select>
								 </div>

								 <div class="mb-0">
									<label for="single-select-disabled-field" class="form-label">Disabled single select</label>
									<select class="form-select" id="single-select-disabled-field" data-placeholder="Choose one thing" disabled>
										
										<option>Reactive</option>
										<option>Solution</option>
										<option>Conglomeration</option>
										<option>Algoritm</option>
										<option>Holistic</option>
									</select>
								</div>
		
							</div>
						</div>


						<h6 class="mb-0 text-uppercase">Multiple select</h6>
						 <hr>
						<div class="card">
						   <div class="card-body">
                               
							<div class="mb-4">
								<label for="multiple-select-field" class="form-label">Basic multiple select</label>
								<select class="form-select" id="multiple-select-field" data-placeholder="Choose anything" multiple>
									<option selected>Christmas Island</option>
									<option selected>South Sudan</option>
									<option selected>Jamaica</option>
									<option>Kenya</option>
									<option>French Guiana</option>
									<option>Mayotta</option>
									<option>Liechtenstein</option>
									<option>Denmark</option>
									<option>Eritrea</option>
									<option>Gibraltar</option>
									<option>Saint Helena, Ascension and Tristan da Cunha</option>
									<option>Haiti</option>
									<option>Namibia</option>
									<option>South Georgia and the South Sandwich Islands</option>
									<option>Vietnam</option>
									<option>Yemen</option>
									<option>Philippines</option>
									<option>Benin</option>
									<option>Czech Republic</option>
									<option>Russia</option>
								</select>
							</div>

							<div class="mb-4">
								<label for="multiple-select-optgroup-field" class="form-label">Multiple select w/ optgroup</label>
								<select class="form-select" id="multiple-select-optgroup-field" data-placeholder="Choose anything" multiple>
									<optgroup label="Group 1">
										<option selected>Christmas Island</option>
										<option>South Sudan</option>
										<option selected>Jamaica</option>
										<option>Kenya</option>
										<option>French Guiana</option>
										<option>Mayotta</option>
									</optgroup>
									<optgroup label="Group 2">
										<option>Liechtenstein</option>
										<option>Denmark</option>
										<option>Eritrea</option>
										<option>Gibraltar</option>
										<option>Saint Helena, Ascension and Tristan da Cunha</option>
										<option>Haiti</option>
										<option>Namibia</option>
									</optgroup>
									<optgroup label="Group 3">
										<option>South Georgia and the South Sandwich Islands</option>
										<option>Vietnam</option>
										<option>Yemen</option>
										<option>Philippines</option>
										<option>Benin</option>
										<option>Czech Republic</option>
										<option>Russia</option>
									</optgroup>
								</select>
							</div>


							<div class="mb-4">
								<label for="multiple-select-clear-field" class="form-label">Multiple select w/ allow clear</label>
								<select class="form-select" id="multiple-select-clear-field" data-placeholder="Choose anything" multiple>
									<option>Christmas Island</option>
									<option>South Sudan</option>
									<option>Jamaica</option>
									<option>Kenya</option>
									<option>French Guiana</option>
									<option selected>Mayotta</option>
									<option selected>Liechtenstein</option>
									<option>Denmark</option>
									<option>Eritrea</option>
									<option>Gibraltar</option>
									<option>Saint Helena, Ascension and Tristan da Cunha</option>
									<option>Haiti</option>
									<option>Namibia</option>
									<option>South Georgia and the South Sandwich Islands</option>
									<option>Vietnam</option>
									<option>Yemen</option>
									<option>Philippines</option>
									<option>Benin</option>
									<option>Czech Republic</option>
									<option>Russia</option>
								</select>
							</div>

							<div class="mb-4">
								<label for="multiple-select-custom-field" class="form-label">Multiple select w/ custom entries</label>
								<select class="form-select" id="multiple-select-custom-field" data-placeholder="Choose anything" multiple>
									<option>Christmas Island</option>
									<option>South Sudan</option>
									<option>Jamaica</option>
									<option>Kenya</option>
									<option>French Guiana</option>
									<option>Mayotta</option>
									<option>Liechtenstein</option>
									<option>Denmark</option>
									<option>Eritrea</option>
									<option>Gibraltar</option>
									<option>Saint Helena, Ascension and Tristan da Cunha</option>
									<option>Haiti</option>
									<option>Namibia</option>
									<option>South Georgia and the South Sandwich Islands</option>
									<option>Vietnam</option>
									<option>Yemen</option>
									<option>Philippines</option>
									<option>Benin</option>
									<option>Czech Republic</option>
									<option>Russia</option>
								</select>
							</div>

							<div class="mb-0">
								<label for="multiple-select-disabled-field" class="form-label">Disabled multiple select</label>
								<select class="form-select" id="multiple-select-disabled-field" data-placeholder="Choose anything" multiple disabled>
									<option>Christmas Island</option>
									<option>South Sudan</option>
									<option>Jamaica</option>
									<option>Kenya</option>
									<option>French Guiana</option>
									<option>Mayotta</option>
									<option>Liechtenstein</option>
									<option>Denmark</option>
									<option>Eritrea</option>
									<option>Gibraltar</option>
									<option>Saint Helena, Ascension and Tristan da Cunha</option>
									<option>Haiti</option>
									<option>Namibia</option>
									<option>South Georgia and the South Sandwich Islands</option>
									<option>Vietnam</option>
									<option>Yemen</option>
									<option>Philippines</option>
									<option>Benin</option>
									<option>Czech Republic</option>
									<option>Russia</option>
								</select>
							</div>

						   </div>
						</div>



						<h6 class="mb-0 text-uppercase">Select with input groups</h6>
						 <hr>
						<div class="card">
						   <div class="card-body">
							
							<div class="card shadow-none border">
								<div class="card-header bg-grd-primary">
									<h6 class="mb-0">Select with Prepend</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<div class="input-group-text">Prepend</div>
										<select class="form-select" id="prepend-text-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
									</div>
									
									<div class="input-group">
										<div class="input-group-text">Prepend</div>
										<select class="form-select" data-placeholder="Choose anything" id="prepend-text-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
									</div>
								</div>
							</div>


							<div class="card shadow-none border">
								<div class="card-header bg-grd-danger">
									<h6 class="mb-0">Select with Button</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<button class="btn btn-outline-secondary" type="button">Prepend</button>
										<select class="form-select" id="prepend-button-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
									</div>
									
									<div class="input-group">
										<button class="btn btn-outline-secondary" type="button">Prepend</button>
										<select class="form-select" data-placeholder="Choose anything" id="prepend-button-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
									</div>
								</div>
							</div>


							<div class="card shadow-none border">
								<div class="card-header bg-grd-info">
									<h6 class="mb-0">Select with Dropdown</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Prepend</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
										<select class="form-select" id="prepend-dropdown-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
									</div>
									
									<div class="input-group mb-0">
										<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Prepend</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
										<select class="form-select" data-placeholder="Choose anything" id="prepend-dropdown-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
									</div>									
								</div>
							</div>


							<div class="card shadow-none border">
								<div class="card-header bg-grd-voilet">
									<h6 class="mb-0">Select with Dropdown Toggle</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<button class="btn btn-outline-secondary">Prepend</button>
										<button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<span class="visually-hidden">Toggle Dropdown</span>
										</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
										<select class="form-select" id="prepend-toggle-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
									</div>
									
									<div class="input-group mb-0">
										<button class="btn btn-outline-secondary">Prepend</button>
										<button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<span class="visually-hidden">Toggle Dropdown</span>
										</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
										<select class="form-select" data-placeholder="Choose anything" id="prepend-toggle-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
									</div>			
								</div>
							</div>


							
							<div class="card shadow-none border">
								<div class="card-header bg-grd-warning">
									<h6 class="mb-0">Select with Append</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<select class="form-select" id="append-text-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
										<div class="input-group-text">Append</div>
									</div>
									
									<div class="input-group mb-0">
										<select class="form-select" data-placeholder="Choose anything" id="append-text-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
										<div class="input-group-text">Append</div>
									</div>
								</div>
							</div>


							<div class="card shadow-none border">
								<div class="card-header bg-grd-voilet">
									<h6 class="mb-0">Select Append with Button</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<select class="form-select" id="append-button-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
										<button class="btn btn-outline-secondary" type="button">Append</button>
									</div>
									
									<div class="input-group mb-0">
										<select class="form-select" data-placeholder="Choose anything" id="append-button-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
										<button class="btn btn-outline-secondary" type="button">Append</button>
									</div>
								</div>
							</div>


							<div class="card shadow-none border">
								<div class="card-header bg-grd-branding">
									<h6 class="mb-0">Select Append with Dropdown</h6>	
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<select class="form-select" id="append-dropdown-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
										<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Append</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
									</div>
									
									<div class="input-group mb-0">
										<select class="form-select" data-placeholder="Choose anything" id="append-dropdown-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
										<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Append</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
									</div>
								</div>
							</div>


							<div class="card shadow-none border">
								<div class="card-header bg-grd-deep-blue">
									<h6 class="mb-0">Select Append with Dropdown Toggle</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<select class="form-select" id="append-toggle-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
										<button class="btn btn-outline-secondary">Append</button>
										<button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<span class="visually-hidden">Toggle Dropdown</span>
										</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
									</div>
									
									<div class="input-group mb-0">
										<select class="form-select" data-placeholder="Choose anything" id="append-toggle-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
										<button class="btn btn-outline-secondary">Append</button>
										<button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<span class="visually-hidden">Toggle Dropdown</span>
										</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
									</div>
								</div>
							</div>


							<div class="card shadow-none border">
								<div class="card-header bg-light">
									<h6 class="mb-0">Select with Prepend & Append</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<div class="input-group-text">Prepend</div>
										<select class="form-select" id="prepend-append-text-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
										<div class="input-group-text">Append</div>
									</div>
									
									<div class="input-group mb-0">
										<div class="input-group-text">Prepend</div>
										<select class="form-select" data-placeholder="Choose anything" id="prepend-append-text-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
										<div class="input-group-text">Append</div>
									</div>
								</div>
							</div>



							<div class="card shadow-none border">
								<div class="card-header bg-light">
									<h6 class="mb-0">Select with Button Prepend & Append</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<button class="btn btn-outline-secondary" type="button">Prepend</button>
										<select class="form-select" id="prepend-append-button-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
										<button class="btn btn-outline-secondary" type="button">Append</button>
									</div>
									
									<div class="input-group mb-0">
										<button class="btn btn-outline-secondary" type="button">Prepend</button>
										<select class="form-select" data-placeholder="Choose anything" id="prepend-append-button-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
										<button class="btn btn-outline-secondary" type="button">Append</button>
									</div>
								</div>
							</div>



							<div class="card shadow-none border">
								<div class="card-header bg-light">
									<h6 class="mb-0">Select with Dropdown Button Prepend & Append</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Prepend</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
										<select class="form-select" id="prepend-append-dropdown-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
										<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Append</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
									</div>
									
									<div class="input-group mb-0">
										<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Prepend</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
										<select class="form-select" data-placeholder="Choose anything" id="prepend-append-dropdown-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
										<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Append</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
									</div>
								</div>
							</div>


							<div class="card shadow-none border mb-0">
								<div class="card-header bg-light">
									<h6 class="mb-0">Select with Dropdown toggle Prepend & Append</h6>
								</div>
								<div class="card-body">
									<div class="input-group mb-3">
										<button class="btn btn-outline-secondary">Prepend</button>
										<button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<span class="visually-hidden">Toggle Dropdown</span>
										</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
										<select class="form-select" id="prepend-append-toggle-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
										<button class="btn btn-outline-secondary">Append</button>
										<button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<span class="visually-hidden">Toggle Dropdown</span>
										</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
									</div>
									
									<div class="input-group mb-0">
										<button class="btn btn-outline-secondary">Prepend</button>
										<button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<span class="visually-hidden">Toggle Dropdown</span>
										</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
										<select class="form-select" data-placeholder="Choose anything" id="prepend-append-toggle-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
										<button class="btn btn-outline-secondary">Append</button>
										<button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<span class="visually-hidden">Toggle Dropdown</span>
										</button>
										<ul class="dropdown-menu">
											<li><a class="dropdown-item" href="#">Action</a></li>
											<li><a class="dropdown-item" href="#">Another action</a></li>
											<li><a class="dropdown-item" href="#">Something else here</a></li>
											<li><hr class="dropdown-divider"></li>
											<li><a class="dropdown-item" href="#">Separated link</a></li>
										</ul>
									</div>

								</div>
							</div>


						  </div>
						</div>


						<h6 class="mb-0 text-uppercase">Select with Sizing</h6>
						 <hr>
						<div class="card">
						   <div class="card-body">

							<div class="card border shadow-none">
								<div class="card-header bg-light">
									<h6 class="mb-0">Small Select2 Options</h6>
								</div>
								<div class="card-body">
									<div class="mb-3">
										<select class="form-select form-select-sm" id="small-bootstrap-class-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
									</div>
								
									<div class="mb-0">
										<select class="form-select form-select-sm" data-placeholder="Choose anything" id="small-bootstrap-class-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
									  </div>
								</div>
							 </div>
							 <div class="card border shadow-none mb-0">
								<div class="card-header bg-light">
									<h6 class="mb-0">Large Select2 Options</h6>
								</div>
								<div class="card-body">
									<div class="mb-3">
										<select class="form-select form-select-lg" id="large-bootstrap-class-single-field" data-placeholder="Choose one thing">
											
											<option>Reactive</option>
											<option>Solution</option>
											<option>Conglomeration</option>
											<option>Algoritm</option>
											<option>Holistic</option>
										</select>
									</div>
									
									<div class="mb-0">
										<select class="form-select form-select-lg" data-placeholder="Choose anything" id="large-bootstrap-class-multiple-field" multiple>
											<option>Christmas Island</option>
											<option>South Sudan</option>
											<option>Jamaica</option>
											<option>Kenya</option>
											<option>French Guiana</option>
											<option>Mayotta</option>
											<option>Liechtenstein</option>
											<option>Denmark</option>
											<option>Eritrea</option>
											<option>Gibraltar</option>
											<option>Saint Helena, Ascension and Tristan da Cunha</option>
											<option>Haiti</option>
											<option>Namibia</option>
											<option>South Georgia and the South Sandwich Islands</option>
											<option>Vietnam</option>
											<option>Yemen</option>
											<option>Philippines</option>
											<option>Benin</option>
											<option>Czech Republic</option>
											<option>Russia</option>
										</select>
									</div>
								</div>
							 </div>
							</div>
						</div>
					</div>
				</div>
				<!--end row-->
    </div>
  </main>
  <!--end main wrapper-->
</template>