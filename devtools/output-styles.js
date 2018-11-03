export default `
  h2, h3 {
    display: inline;
  }

  iframe {
    width: 100%;
    border: 0;
  }

  summary {
    cursor: pointer;
  }

  .summary .status {
    font-size: 4rem;
  }

  .status.ok {
    color: #21ba45;
  }

  .status.failed {
    color: #db2828;
  }

  .status.other {
    color: #767676;
  }

  .summary img {
    height: 150px !important;
  }
`;
