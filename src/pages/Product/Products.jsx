return (

  <div className={styles.container}>

    <Helmet>
      <title>Product Page</title>
    </Helmet>

    <Header />

    <div className={styles.main}>

      {/* ================= FILTER + SORT ================= */}

      <div className={styles.topBar}>

        {/* FILTER */}

        <div className={styles.filterBox}>

          <FaBars className={styles.filterIcon} />

          <span className={styles.filterLabel}>
            Filter:
          </span>

          <select
            value={category}
            onChange={(e) => {

              setCategory(e.target.value);
              setPage(1);

            }}
          >

            <option value="all">
              All Categories
            </option>

            {categories.map((c) => {

              const catName =
                c.name || c.category || "Unknown";

              return (

                <option
                  key={c._id}
                  value={catName}
                >
                  {catName}
                </option>

              );

            })}

          </select>

        </div>

        {/* SORT */}

        <div className={styles.filterBox}>

          <FaBars className={styles.filterIcon} />

          <span className={styles.filterLabel}>
            Price:
          </span>

          <select
            value={value[1]}
            onChange={(e) => {

              setValue([0, Number(e.target.value)]);
              setPage(1);

            }}
          >

            <option value={1000}>
              Low to High
            </option>

            <option value={300}>
              Under ₹300
            </option>

            <option value={500}>
              Under ₹500
            </option>

            <option value={1000}>
              Under ₹1000
            </option>

          </select>

        </div>

      </div>

      {/* ================= PRODUCTS ================= */}

      {loading && (

        <p className={styles.loading}>
          Loading...
        </p>

      )}

      <div className={styles.productGrid}>

        {products.map((p) => (

          <div
            key={p._id}
            className={styles.card}
            onClick={() => openProduct(p._id)}
          >

            {/* IMAGE */}

            <div className={styles.imageBox}>

              <img
                src={p.images?.[0]?.url}
                alt={p.name}
              />

            </div>

            {/* CONTENT */}

            <div className={styles.content}>

              <h2>{p.name}</h2>

              <p>
                {p.subName}
              </p>

              <div className={styles.priceRow}>

                <span className={styles.price}>
                  ₹{p.price}
                </span>

              </div>

              <button className={styles.cartBtn}>

                Add to Cart

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ================= PAGINATION ================= */}

      <div className={styles.pagination}>

        <button
          className={`${styles.pageBtn} ${page === 1 ? styles.activePage : ""}`}
          onClick={prevPage}
          disabled={page === 1}
        >
          ←
        </button>

        <button
          className={styles.pageBtn}
          onClick={nextPage}
          disabled={page * limit >= total}
        >
          →
        </button>

      </div>

    </div>

    <Footer />

  </div>

);