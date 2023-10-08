App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        return await App.initWeb3();
    },

    initWeb3: function () {
        if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        } else {
            App.web3Provider = new Web3.proviers.HttpProvider('http://localhost:7545');
        }

        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: async function () {
        try {
            const response = await $.getJSON('product.json');
            const productArtifact = response; // Assuming the JSON structure is correct

            App.contracts.product = TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);

            // Now, the contract should be initialized, and you can proceed with other steps
            return App.bindEvents();
        } catch (error) {
            console.error('Error initializing contract:', error);
        }
    },

    bindEvents: function () {

        $(document).on('click', '.btn-register', App.getData);
    },

    getData: function () {
        // event.preventDefault();
        // var sellerCode = document.getElementById('sellerCode').value;
        // console.log('sellerCode ' + sellerCode);
        var productInstance;
        //window.ethereum.enable();
        web3.eth.getAccounts(function (error, accounts) {

            if (error) {
                console.log(error);
            }

            var account = accounts[0];
            // console.log(account);

            App.contracts.product.deployed().then(function (instance) {

                productInstance = instance;
                console.log('productInstance', productInstance);
                return productInstance.viewProductItems({ from: account });

            }).then(function (result) {

                //console.log()
                var productIds = [];
                var productSNs = [];
                var productNames = [];
                var productBrands = [];
                var productPrices = [];
                var productStatus = [];

                console.log('result', result);

                for (var k = 0; k < result[0].length; k++) {
                    productIds[k] = result[0][k];
                }

                for (var k = 0; k < result[1].length; k++) {
                    productSNs[k] = web3.toAscii(result[1][k]);
                }

                console.log('result1', web3.toAscii(result[1][8]));

                for (var k = 0; k < result[2].length; k++) {
                    productNames[k] = web3.toAscii(result[2][k]);
                }

                for (var k = 0; k < result[3].length; k++) {
                    productBrands[k] = web3.toAscii(result[3][k]);
                }

                for (var k = 0; k < result[4].length; k++) {
                    productPrices[k] = result[4][k];
                }

                for (var k = 0; k < result[5].length; k++) {
                    productStatus[k] = web3.toAscii(result[5][k]);
                }

                console.log('imagesUrl', imageUrls);

                var cardsContent = "";
                document.getElementById('logdata').innerHTML = cardsContent;
                for (var i = 0; i < result[0].length; i++) {

                    if (productPrices[i] === "0") {
                        break;
                    }

                    var card = '<div class="col-md-4">';
                    card += '<div class="card mb-4">';

                    // Display the image from the imageUrls array
                    var storedImageUrls = localStorage.getItem('imageUrls');
                    if (storedImageUrls) {
                        imageUrls = JSON.parse(storedImageUrls);
                    }
                    if (imageUrls[i]) {
                        card += '<img height=250px; width=100%; src="' + imageUrls[i] + '" class="card-img-top" alt="Product Image" >';
                    } else {
                        card += '<div class="card-header">No Image</div>';
                    }

                    card += '<div class="card-body">';
                    card += '<h5 class="card-title">Product ID: ' + productIds[i] + '</h5>';
                    card += '<p class="card-text">Product SN: ' + productSNs[i] + '</p>';
                    card += '<p class="card-text">Product Name: ' + productNames[i] + '</p>';
                    card += '<p class="card-text">Product Brand: ' + productBrands[i] + '</p>';
                    card += '<p class="card-text">Price: $' + productPrices[i] + '</p>';
                    card += '<p class="card-text">Status: ' + productStatus[i] + '</p>';
                    card += '</div>'; // end of card-body

                    card += '</div>'; // end of card
                    card += '</div>'; // end of col-md-4

                    cardsContent += card;
                }

                document.getElementById('logdata').innerHTML = cardsContent;

                document.getElementById('add').innerHTML = account;
                $(document).ready(function () {
                    // Initialize the table as a DataTable with options
                    $("#productsTable").DataTable({
                        searching: true, // Enable searching
                        paging: true, // Enable pagination
                        ordering: true, // Enable sorting
                        info: true, // Show info (e.g., "Showing 1 to 10 of 20 entries")
                    });
                });

            }).catch(function (err) {
                console.log(err.message);
            })
        })
    }
};

$(function () {
    $(window).load(async function () {
        await App.init(); // Wait for App.init() to complete
        App.getData();    // Now call App.getData() safely
    });
});
