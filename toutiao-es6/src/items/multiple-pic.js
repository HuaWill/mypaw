import Component from './component';

export default class MultiplePic extends Component {

    render() {
        const { data } = this.props;

        const imageList = data.imageList.map(imageUrl => {
            return `<img src=${imageUrl} />`;
        }).join('');

        return `<div class="item multiple-image">
                    <h3>
                        ${data.title}
                    </h3>
                    <div class="image-list">
                        ${imageList}
                    </div>
                </div>`;
    }
}
