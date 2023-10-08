App = {
    web3Provider: null,
    productSNs: [], // Define productSNs as a global array
    contracts: {},

    init: async function () {
        return await App.initWeb3();
    },

    getProductsData: function () {
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

                for (var i = 0; i < result[0].length; i++) {
                    App.productSNs.push(productSNs[i]);
                    console.log(App.productSNs[i]);
                }



            }).catch(function (err) {
                console.log(err.message);
            })
        })
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

    initContract: function () {

        $.getJSON('product.json', function (data) {

            var productArtifact = data;
            App.contracts.product = TruffleContract(productArtifact);
            App.contracts.product.setProvider(App.web3Provider);
        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-register', App.getData);
    },

    getData: function (event) {
        event.preventDefault();
        var productSN = document.getElementById('productSN').value;
        var consumerCode = document.getElementById('productSN').value;
        var productInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];
            App.contracts.product.deployed().then(function (instance) {
                productInstance = instance;
                // Instead of verifying, check if productSN exists in the array


                return productInstance.viewProductItems({ from: account });

            }).then(function (result) {

                var productIds = [];
                var productSNs = [];
                var productNames = [];
                var productBrands = [];
                var productPrices = [];
                var productStatus = [];
                var isProductExists = false;

                // Display the image from the imageUrls array
                var storedImageUrls = localStorage.getItem('imageUrls');
                if (storedImageUrls) {
                    imageUrls = JSON.parse(storedImageUrls);
                }

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

                for (var k = 0; k < result[1].length; k++) {
                    productSNs[k] = web3.toAscii(result[1][k]);

                }

                var index = 0;

                for (var i = 0; i < result[0].length; i++) {
                    App.productSNs.push(productSNs[i]);
                    if (productSN === App.productSNs[i].replace(/\0/g, '')) {
                        isProductExists = true;
                        index == i;
                        console.log('true');
                    }

                    console.log(App.productSNs[i], " : ", productSN);
                }



                //var isProductExists = App.productSNs.includes(productSN);
                // return isProductExists;
                var t = "";
                var tr = "<tr>";
                if (isProductExists) {
                    tr += "<th>STATUS<td>NAME</td><td>PRICE</td><td>IMAGE</td></th></tr><tr>";

                    tr += "<td>" + "VALID PRODUCT" + "</td>";
                    tr += "<td>" + productNames[index] + "</td>";
                    tr += "<td>" + "RM " + productPrices[index] + "</td>";
                    tr += "<td>" + "<img src='" + imageUrls[index] + "'alt='Product Image' width='100'></img></td>";
                } else {
                    tr += "<td>" + "INVALID PRODUCT" + "</td>";
                }
                tr += "</tr>";
                t += tr;

                document.getElementById('logdata').innerHTML = t;
                document.getElementById('add').innerHTML = account;
            }).catch(function (err) {
                console.log(err.message);
            })
        })
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    })
})