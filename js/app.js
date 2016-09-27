/**
 * Created by driversti on 9/26/16.
 */
//console.log(React);
//console.log(ReactDOM);

var photos = ['images/cat.jpg', 'images/dog.jpg', 'images/owl.jpg'];

window.ee = new EventEmitter();

var my_cars = [
    {
        brand: 'Subaru',
        model: 'Impreza WRX STi',
        bigText: 'Don’t let the giant trunk wing fool you: ' +
        'The STI is not about to go airborne before your very eyes. ' +
        'With 305 hp from its 2.5-liter turbo four-cylinder, ' +
        'it’s just not the performance threat that it used to be. ' +
        'A six-speed manual, limited-slip differentials, ' +
        'and torque vectoring help keep the STI glued to the road. ' +
        'Its steering is laser-quick and its brakes grip like crazy. ' +
        'The result makes it entertaining to drive, ' +
        'but it comes at the price of a punishing ride—and a punishing price.'
    },
    {
        brand: 'Audi',
        model: 'S7',
        bigText: 'Not only can the S7 please enthusiast drivers with its fluid responses ' +
        'and beastly power, it also hides hatchback versatility under its swept-back design. ' +
        'A 450-hp 4.0-liter twin-turbo V-8 powers all four wheels through a seven-speed ' +
        'dual-clutch automatic; an adjustable suspension offers settings to suit every mood. ' +
        'To top it off, the S7’s chic interior and a long list of available tech and ' +
        'infotainment options can make the cabin a comfortable, ' +
        'luxurious place to be while eating up the miles.'
    },
    {
        brand: 'BMW',
        model: '650',
        bigText: 'With the 6-series, BMW has a clear winner on its hands. ' +
        'The beautiful coupe, based on the 5-series sedan, ' +
        'has exceeded expectations—despite highly ambitious pricing that positions it close ' +
        'to the range-topping 7-series. Even though the four-door Gran Coupe, ' +
        'a direct competitor of the Audi A7 and the Mercedes-Benz CLS, ' +
        'has become the most popular 6-series model, BMW had us drive the traditional two-door coupe ' +
        'at the international launch in Lisbon, Portugal.'
    },
    {
        brand: 'Mercedes-Benz',
        model: 'GLC',
        bigText: 'Put the C-class sedan on stilts and you get the GLC-class, ' +
        'a competent luxury crossover that also features the excellent interior of its sedan sibling. ' +
        'There’s lots of standard tech and safety, including collision-prevention and crosswind assist, ' +
        'adaptive suspension, and keyless start. The GLC300 has a 241-hp 2.0-liter ' +
        'four that pairs with a paddle-shifted nine-speed automatic and rear drive; ' +
        'all-wheel drive is optional. The seats are comfortable, the interior quiet, ' +
        'just like a real Mercedes.'
    }
];

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            brand: React.PropTypes.string.isRequired,
            model: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },
    readMoreClick: function (e) {
        e.preventDefault();
        this.setState({visible: true});
    },
    lessClick: function (e) {
        e.preventDefault();
        this.setState({visible: false});
    },
    render: function () {
        var brand = this.props.data.brand,
            model = this.props.data.model,
            bigText = this.props.data.bigText,
            visible = this.state.visible;

        //console.log('render', this);

        return (
            <div className="article">
                <p className="car"><span className="brand">{brand}</span> - <span className="model">{model}</span></p>

                {/* для ссылки readMore: не показывай ссылку, если visible === true */}
                <a href="#"
                   className={'readMore ' + (visible ? 'none' : '')}
                   onClick={ this.readMoreClick }>

                    more
                </a>

                {/* для большо текста: не показывай текст, если visible === false */}
                <p className={'big-text ' + (visible ? '' : 'none')}>{bigText}</p>

                <div className="less"><a href="#"
                                         className={'readMore less ' + (visible ? '' : 'none')}
                                         onClick={ this.lessClick }>
                    less
                </a></div>
            </div>
        );
    }
});

var Cars = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    render: function () {
        var data = this.props.data;
        var carsTemplate;

        if (data.length > 0) {
            carsTemplate = data.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article data={item}/>
                    </div>
                )
            });
        } else {
            carsTemplate = <p>No cars</p>
        }

        //console.log('render', this);
        return (
            <div className="car">
                {carsTemplate}
                <strong
                    className={'cars_count ' + (data.length > 0 ? '' : 'none')}>
                    Car's amount: {data.length}
                </strong>
            </div>
        );
    }
});

var Add = React.createClass({
    getInitialState: function () {
        return {
            agreeNotChecked: true,
            brandIsEmpty: true,
            modelIsEmpty: true,
            textIsEmpty: true
        }
    },
    componentDidMount: function () {
        ReactDOM.findDOMNode(this.refs.brand).focus();
    },
    onFieldChange: function (fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({['' + fieldName]: false})
        } else {
            this.setState({['' + fieldName]: true})
        }
    },
    onButtonClick: function (e) {
        e.preventDefault();
        var brand = ReactDOM.findDOMNode(this.refs.brand).value;
        var model = ReactDOM.findDOMNode(this.refs.model).value;
        var textEl = ReactDOM.findDOMNode(this.refs.text);
        var text = textEl.value;

        var item = [{
            brand: brand,
            model: model,
            bigText: text
        }];

        window.ee.emit('Cars.add', item);
        textEl.value = '';
        this.setState({textIsEmpty: true});
    },
    onCheckRuleClick: function (e) {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },

    render: function () {
        var agreeNotChecked = this.state.agreeNotChecked,
            brandIsEmpty = this.state.brandIsEmpty,
            modelIsEmpty = this.state.modelIsEmpty,
            textIsEmpty = this.state.textIsEmpty;
        return (
            <form className="add cf">
                <input
                    type="text"
                    className='add_brand'
                    onChange={this.onFieldChange.bind(this, 'brandIsEmpty')}
                    placeholder='Enter brand'
                    ref='brand'
                />
                <input
                    type="text"
                    className='add_model'
                    onChange={this.onFieldChange.bind(this, 'modelIsEmpty')}
                    placeholder='Enter model'
                    ref='model'
                />
                <textarea
                    className="add_text"
                    onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                    placeholder="Enter news"
                    ref="text">
                </textarea>
                <label className="add_checkRule">
                    <input
                        type="checkbox"
                        ref="checkRule"
                        onChange={this.onCheckRuleClick}/> I'm agree with terms
                </label>
                <button
                    className="add_btn"
                    onClick={this.onButtonClick}
                    ref='alert_button'
                    disabled={agreeNotChecked || brandIsEmpty || modelIsEmpty || textIsEmpty}>
                    Add car
                </button>
            </form>
        );
    }
});

var App = React.createClass({
    getInitialState: function () {
        return {
            cars: my_cars
        };
    },
    componentDidMount: function () {
        var self = this;
        window.ee.addListener('Cars.add', function (item) {
            var nextCars = item.concat(self.state.cars);
            self.setState({cars: nextCars})
        });
    },
    componentWillUnmount: function () {
        window.ee.removeListener('Cars.add');
    },
    render: function () {
        return (
            <div className="app">
                <Add/>
                <h3>Cars</h3>
                <Cars data={ this.state.cars }/> {/* deleted  */}

            </div>
        );
    }
});

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);