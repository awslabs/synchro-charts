We welcome all kinds of contribution from the community!

Important things to know when building a new component:
1. Use `viewportHandler` to sync up with all the other componenet in order to provide the synchronization feature.
   - A good example to follow is the `sc-table` component.
```js static
  componentDidLoad() {
    this.viewportGroups.add({ viewportGroup: 'The name of the viewport group' }) 
  }
  
  disconnectedCallback() {
    this.viewportGroups.remove(); // clean up
  }
```